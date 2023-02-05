import fs from 'fs'

/**
 * Delete a file if exists
 */
export function deleteFileIfExists(path: string) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
}

/**
 * Delete a directory if exists
 */
export function deleteDirectoryIfExists(path: string) {
  if (fs.existsSync(path)) {
    fs.rmdirSync(path)
  }
}
