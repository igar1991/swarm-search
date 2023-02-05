import fs from 'fs'
import { join } from 'path'
import { startIndexer } from '../../src/indexer/app'
import { getDbHelper, getRowsCount } from '../utils/db'
import sqlite3 from 'sqlite3'
import { SEARCH_FILES, SEARCH_WIKI_TITLES } from '../../src/indexer/utils'
import { deleteFileIfExists } from '../../src/shared/utils/file'

const dataPath = join(__dirname, 'data/en')
const linesFilePath = join(__dirname, '../data/suggest/en_wiki_voyage.txt')
const dbOutFilesPath = join(__dirname, '../data/suggest/DB_indexer_files.db')
const dbOutLinesPath = join(__dirname, '../data/suggest/DB_indexer_lines.db')

jest.setTimeout(500000)
const likeQuery = 'SELECT * FROM items WHERE name LIKE ? COLLATE NOCASE LIMIT 10;'
describe('Indexer', () => {
  beforeEach(() => {
    process.env.INDEXER_MUTE_PROCESS_LOGS = 'true'
    process.env.INDEXER_SEARCH_PATH = dataPath
    process.env.INDEXER_LINES_FILE_PATH = linesFilePath
    deleteFileIfExists(dbOutFilesPath)
    deleteFileIfExists(dbOutLinesPath)
  })

  afterAll(() => {
    deleteFileIfExists(dbOutFilesPath)
    deleteFileIfExists(dbOutLinesPath)
  })

  it('files are available', () => {
    const files = fs.readdirSync(dataPath)
    expect(files).toEqual(['"Hello, World!" program.txt', 'H.txt', 'He.txt', 'Hell.txt', 'Hello.txt'])
  })

  it('files are added to db and available for queries', async () => {
    process.env.INDEXER_OUTPUT_PATH = dbOutFilesPath
    process.env.INDEXER_SEARCH_TYPE = SEARCH_FILES
    await startIndexer()

    const db = new sqlite3.Database(dbOutFilesPath)
    const { all } = getDbHelper(db)
    expect(fs.existsSync(dbOutFilesPath)).toEqual(true)
    const count = await getRowsCount(dbOutFilesPath, 'items')
    expect(count).toEqual(5)

    const responseHLower = await all(likeQuery, ['h%'])
    expect(responseHLower).toHaveLength(4)

    const responseHUpper = await all(likeQuery, ['H%'])
    expect(responseHUpper).toHaveLength(4)

    const responseSymbol = await all(likeQuery, ['"%'])
    expect(responseSymbol).toHaveLength(1)
  })

  it('lines are added to db and available for queries', async () => {
    process.env.INDEXER_OUTPUT_PATH = dbOutLinesPath
    process.env.INDEXER_SEARCH_TYPE = SEARCH_WIKI_TITLES
    await startIndexer()

    const db = new sqlite3.Database(dbOutLinesPath)
    const { all } = getDbHelper(db)
    expect(fs.existsSync(dbOutLinesPath)).toEqual(true)
    const count = await getRowsCount(dbOutLinesPath, 'items')
    expect(count).toEqual(12850)
    const responseHLower = await all(likeQuery, ['h%'])
    expect(responseHLower).toHaveLength(10)

    const responseHel = await all(likeQuery, ['hel%'])
    expect(responseHel).toHaveLength(10)
    expect(responseHel[0].name).toEqual('HEL')
    expect(responseHel[1].name).toEqual('Hel')
    expect(responseHel[2].name).toEqual('Helen')
    expect(responseHel[3].name).toEqual('Helen,_GA')
    expect(responseHel[4].name).toEqual('Helena')
    expect(responseHel[5].name).toEqual('Helena_(Arkansas)')
    expect(responseHel[6].name).toEqual('Helena_(Montana)')
    expect(responseHel[7].name).toEqual('Helena_(disambiguation)')
    expect(responseHel[8].name).toEqual('Helensburgh')
    expect(responseHel[9].name).toEqual('Helensburgh_(New_South_Wales)')

    const responseSymb = await all(likeQuery, ['Ż%'])
    expect(responseSymb).toHaveLength(6)
    expect(responseSymb[0].name).toEqual('Żabbar')
    expect(responseSymb[1].name).toEqual('Żejtun')
    expect(responseSymb[2].name).toEqual('Żnin')
    expect(responseSymb[3].name).toEqual('Żoliborz')
    expect(responseSymb[4].name).toEqual('Żywiec')
    expect(responseSymb[5].name).toEqual('Żywiecki_Beskids')
  })
})
