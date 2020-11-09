import electron from 'electron'

import { iCreateFileObject, iServerFileCreateUpdateResponse, iFileContents } from '../components/models';

export async function fileCreate(fileProperties: iCreateFileObject) {
  const payload = {
    fileName: `ContactFile_${new Date().getTime().toString()}`,
    password: fileProperties.password
  };
  const result: iServerFileCreateUpdateResponse = await electron.ipcRenderer.invoke(
    'create-file',
    payload
  );

  return result
}

export async function fileOpen(filePath: string | null, password: string) {
  const payload = { filePath: filePath, password: password };
  const result: iServerFileCreateUpdateResponse = await electron.ipcRenderer.invoke(
    'upload-file',
    payload
  );

  return result
}

export async function fileUpdate(filePath: string | null, password: string, data: iFileContents) {
  const payload = { filePath: filePath, password: password, fileData: data};
  const result: iServerFileCreateUpdateResponse = await electron.ipcRenderer.invoke(
    'update-file',
    payload
  );

  return result
}
