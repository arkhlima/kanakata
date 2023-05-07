export type CharGroup = (string | null)[][]

export const MONOGRAPHS: CharGroup = [
   ['a', 'i', 'u', 'e', 'o'], // ∅
   ['ka', 'ki', 'ku', 'ke', 'ko'], // K
   ['sa', 'shi', 'su', 'se', 'so'], // S
   ['ta', 'chi', 'tsu', 'te', 'to'], // T
   ['na', 'ni', 'nu', 'ne', 'no'], // N
   ['ha', 'hi', 'fu', 'he', 'ho'], // H
   ['ma', 'mi', 'mu', 'me', 'mo'], // M
   ['ya', null, 'yu', null, 'yo'], // Y
   ['ra', 'ri', 'ru', 're', 'ro'], // R
   ['wa', null, null, null, 'wo'], // W
   ['n', null, null, null, null], // n
]

export const MONOGRAPH_DIACRITICS: CharGroup = [
   ['ga', 'gi', 'gu', 'ge', 'go'], // GA
   ['za', 'ji', 'zu', 'ze', 'zo'], // ZA
   ['da', 'ji', 'zu', 'de', 'do'], // DA
   ['ba', 'bi', 'bu', 'be', 'bo'], // BA
   ['pa', 'pi', 'pu', 'pe', 'po'], // PA
]
