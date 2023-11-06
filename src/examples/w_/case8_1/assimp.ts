import type { Ajs, AssimpData } from '@/interface/assimp'

export default class Assimp {
  static ajs: Ajs;

  static ready() {
    const timer = setInterval(() => {
      if (this.ajs) {
        return clearInterval(timer)
      }
      this.ajs = window.assimp
    }, 0)
  }

  static async load(files: string[]) {
    const { ajs } = this
    const rsp = await Promise.all(files.map((file) => fetch(file)))
    const buffers = await Promise.all(rsp.map((res) => res.arrayBuffer()))

    // create new file list object, and add the files
    const fileList = new ajs.FileList();
    for (let i = 0; i < files.length; i++) {
      fileList.AddFile(files[i], new Uint8Array(buffers[i]));
    }

    // convert file list to assimp json
    const result = ajs.ConvertFileList(fileList, 'assjson');

    // check if the conversion succeeded
    if (!result.IsSuccess() || result.FileCount() == 0) {
      console.log(result.GetErrorCode())
      return;
    }
    // get the result file, and convert to string
    const resultFile = result.GetFile(0);
    const jsonContent = new TextDecoder().decode(resultFile.GetContent());

    // parse the result json
    const resultJson = JSON.parse(jsonContent);
    // console.log('resultJson', resultJson)
    return resultJson as AssimpData
  }

}

