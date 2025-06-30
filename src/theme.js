import { createTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, red, teal } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme} from '@mui/material/styles'

// A custom theme for this app
const theme = extendTheme({
  trello: {
    appBarHeight: "48px",
    boardBarHeight: "58px"
  },


  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        main: deepOrange
      }
    },
    dark: {
      palette: {
        primary: cyan,
        main: orange
      }
    }
  }
  // ...other properties
})


export default theme