export const getSplittedChars = (char: string) => {
   return char.split(/(?=[A-Z])/)
}

export const getCharGroupTitle = (char: string) => {
   const removeFirstTwoWords: string[] = getSplittedChars(char).slice(2)
   return removeFirstTwoWords.join(' ').toLocaleLowerCase()
}
