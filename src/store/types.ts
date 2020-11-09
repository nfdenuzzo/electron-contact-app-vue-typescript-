
export interface iContactList {
  [id: number]: iContactStructure
}

export interface iContactsListIndexable {
  id: string[],
  name: string[],
  phone: string[],
  email: string[],
  address: string[],
  [key: string]: string[]; 
}

export interface iFileContents {
  fileContents: Array<iContactStructure>
}

export interface iStatePassword {
  filePassword: string
}

export interface iStatePath {
  filePath: string
}

export interface iGeneralState {
  filePassword: string,
  filePath: string,
  fileContents: Array<iContactStructure>
}

export interface iContactStructure {
  id: string,
  name: string,
  phone: string,
  email: string,
  address: string
}

export interface isFirstRunResult {
  isFirstRun: boolean
}