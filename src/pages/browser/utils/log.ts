export const log = function (type = 'default', val: any) {
  console.log(
    ` %c 🌝🇨🍡${type} 🍡🇨🌝`,
    'background-color: #2196f3; padding: 4px; border-radius: 2px; font-size: 12px; color: #fff; text-transform: uppercase; font-weight: 600;',
    val
  )
}
