
import { walkSync } from "https://deno.land/std@0.125.0/fs/mod.ts"

const inputRoute = './'
console.log('start')
let selectRoute = prompt('select route (./)')
console.log('Making json files...')
let fileOutputRoute = prompt('Selec route file: (./)')
let fileOutputName = prompt('File name: (output)')

if(!selectRoute) {
  selectRoute = inputRoute
}

if(!fileOutputRoute){
  fileOutputRoute = './'
} else {
  const lastIndex = fileOutputRoute.split('').length - 1
  if(fileOutputRoute[lastIndex] !== '/'){
    fileOutputRoute += '/'
  }
}
 
if (!fileOutputName) {
  fileOutputName = 'output'
}

const data = []

for (const entry of walkSync(selectRoute)) {
  const file = await Deno.stat(entry.path)

  if (file.isFile) {

    const myUUID = crypto.randomUUID()

    const id = myUUID.replace(/-/g, '')
    const fileName = entry.path
    const fileNameWithoutExtension = fileName.split('.')[0]
    const extension = fileName.split('.')[1]
    const fileMtime = file.mtime
    const fileSize = file.size
    const relativePath = fileName.replace(inputRoute, '')
    const absolutePath = Deno.cwd(fileName)
    const message = `${entry.path}, ${file.mtime?.toLocaleString()}, ${file.size} bytes`


    const dataFile = {
      id,
      fileName,
      fileNameWithoutExtension,
      extension,
      fileMtime,
      fileSize,
      relativePath,
      absolutePath,
      message
    }

    async function getJson(filePath) {
      return JSON.parse(await Deno.readTextFile(filePath))
    }

    const readFile = await getJson(`${fileOutputRoute}/${fileOutputName}.json`).catch(e => {
      writeJson(`${fileOutputRoute}${fileOutputName}.json`, [])
    })

    if (readFile) {
      readFile.find(async (file) => {
        if (file.id === dataFile.id) {
          console.log(`id already exists: ${file.id}`)
        }
        if (file.absolutePath === absolutePath) {
          console.log(`File already index: ${file.absolutePath}, change the name to make a new report`)
        }
        data.push(dataFile)
      })
    } else {
      data.push(dataFile)
    }


  }
}

async function writeJson(filePath, o) {
  await Deno.writeTextFile(filePath, JSON.stringify(o))
}

writeJson(`${fileOutputRoute}${fileOutputName}.json`, data)




