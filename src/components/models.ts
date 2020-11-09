export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}


export interface iFileUploadResponse {
  canceled: boolean;
  filePaths: Array<string>;
}

export interface iCreateFileObject {
  fileName: string;
  password: string;
}

export interface iFileContents {
  [id: number]: Array<iFileContentStructure>
}

export interface iServerFileCreateUpdateResponse {
  readonly filePassword: string;
  readonly filePath: string;
  readonly message?: string;
  readonly status: number;
  readonly fileContents?: Array<iFileContentStructure>;
}

export interface iFileContentStructure {
  readonly id: string,
  readonly name: string,
  readonly phone: string,
  readonly email: string,
  readonly address: string
}
