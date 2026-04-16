import { defineStore } from 'pinia'

export const codeAnswersStore = defineStore('event', {
  state: () => ({
    answerSelected: true
  }),
  actions: {
    setAnswerSelected(selected: boolean) {
        this.answerSelected = selected;
    }
  }
})