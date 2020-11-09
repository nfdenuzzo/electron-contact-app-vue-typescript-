import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { iGeneralState, iStatePassword, iStatePath, iFileContents, iContactStructure } from './types'

export const state: iGeneralState = {
  filePassword: '',
  filePath: '',
  fileContents: []
}

export const getters: GetterTree<iGeneralState, iGeneralState> = {
  getfilePassword: state => state.filePassword,
  getFilePath: state => state.filePath,
  getFileContents: state => state.fileContents
}

export const mutations: MutationTree<iGeneralState> = {
  setFilePassword(state, payload: iStatePassword) {
    state.filePassword = payload.filePassword
  },
  setFilePath(state, payload: iStatePath) {
    state.filePath = payload.filePath
  },
  setFileContents(state, payload: iFileContents) {
    state.fileContents = payload.fileContents
  },
  setAddContactToFile(state, payload: iContactStructure) {
    state.fileContents.push(payload)
  },
  setUpdateContact(state, payload: Array<iContactStructure>) {
    state.fileContents = payload
  }
}

export const actions: ActionTree<iGeneralState, iGeneralState> = {
  saveFileContentsOpened({ commit }, payload: iFileContents): void {
    commit('setFileContents', payload);
    commit('setFilePassword', payload);
    commit('setFilePath', payload);
  },
  saveFileContents({ commit }, payload: iFileContents): void {
    commit('setFileContents', payload);
  },
  clearGeneralDetails({ commit }): void {
    commit('setFilePassword', { filePassword: '' });
    commit('setFileContents', { fileContents: [] });
    commit('setFilePath', { filePath: '' });
  },
  clearFileDetails({ commit }): void {
    commit('setFilePassword', { filePassword: '' });
    commit('setFileContents', { fileContents: [] });
  },
  clearFileContents({ commit }): void {
    commit('setFileContents', { fileContents: [] });
  },
  deleteContact({ commit, rootGetters }, payload: iContactStructure): void {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    const data: Array<iContactStructure> = rootGetters.getFileContents;
    const matchingContactIndex = data.findIndex((contact: iContactStructure) => contact.id === payload.id);
    data.splice(matchingContactIndex, 1)
    commit('setUpdateContact', data);
  },
  updateContact({ commit, rootGetters }, payload: iContactStructure): void {
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    const data: Array<iContactStructure> = rootGetters.getFileContents;
    const matchingContactIndex = data.findIndex((contact: iContactStructure) => contact.id === payload.id);
    data.splice(matchingContactIndex, 1, payload)
    commit('setUpdateContact', data);
  },
  createContact({ commit }, payload: iContactStructure): void {
    commit('setAddContactToFile', payload);
  }
}