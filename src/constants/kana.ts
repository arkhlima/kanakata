export type CharGroup = (string | null)[][]

export type Script = 'hiragana' | 'katakana' | 'kana'

export const MONOGRAPHS: CharGroup = [
   ['あ', 'い', 'う', 'え', 'お'], // ∅
   ['か', 'き', 'く', 'け', 'こ'], // K
   ['さ', 'し', 'す', 'せ', 'そ'], // S
   ['た', 'ち', 'つ', 'て', 'と'], // T
   ['な', 'に', 'ぬ', 'ね', 'の'], // N
   ['ま', 'み', 'む', 'め', 'も'], // H
   ['は', 'ひ', 'ふ', 'へ', 'ほ'], // M
   ['や', null, 'ゆ', null, 'よ'], // Y
   ['ら', 'り', 'る', 'れ', 'ろ'], // R
   ['わ', null, null, null, 'を'], // W
   ['ん', null, null, null, null], // n
]

export const DIAGRAPHS: CharGroup = [
   ['きゃ', 'きゅ', 'きょ'], // KY
   ['しゃ', 'しゅ', 'しょ'], // SH
   ['ちゃ', 'ちゅ', 'ちょ'], // CH
   ['にゃ', 'にゅ', 'にょ'], // NY
   ['ひゃ', 'ひゅ', 'ひょ'], // HY
   ['みゃ', 'みゅ', 'みょ'], // MY
   ['りゃ', 'りゅ', 'りょ'], // RY
]

export const MONOGRAPH_DIACRITICS: CharGroup = [
   ['が', 'ぎ', 'ぐ', 'げ', 'ご'], // G
   ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'], // Z
   ['だ', 'ぢ', 'づ', 'で', 'ど'], // D
   ['ば', 'び', 'ぶ', 'べ', 'ぼ'], // B
   ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'], // P
]

export const DIAGRAPH_DIACRITICS: CharGroup = [
   ['ぎゃ', 'ぎゅ', 'ぎょ'], // KY
   ['じゃ', 'じゅ', 'じょ'], // J
   ['びゃ', 'びゅ', 'びょ'], // BY
   ['ぴゃ', 'ぴゅ', 'ぴょ'], // PY
]
