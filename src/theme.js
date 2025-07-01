import { createTheme } from '@mui/material/styles'
// import { cyan, deepOrange, orange, red, teal } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme} from '@mui/material/styles'

// A custom theme for this app
const theme = extendTheme({
  trello: {
    appBarHeight: "58px",
    boardBarHeight: "60px"
  },


  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     main: deepOrange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     main: orange
    //   }
    // }
  },

  
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
         textTransform: 'none',
         borderWidth: '0,5px',
         "&:hover": {borderWidth: '2px',},
         
        },
      },
    },
  },
    components: {
      // Name of the component
      MuiCssBaseline: {
        styleOverrides: {
          // Name of the slot
          body: {
            '*::-webkit-scrollbar':{
              width: '8px',
              height: '8px'
            },
            '*::-webkit-scrollbar-thumb':{
              backgroundColor: '#dcdde1',
              borderRadius: '8px'
            },
            '*::-webkit-scrollbar-thumb:hover':{
              backgroundColor: '#white',
             
            }
          },
        },
      },

    MuiInputLabel: {
      styleOverrides: {
        // Name of the slot
        root:  {  fontSize: '0.875rem'}
          // color: theme.palette.primary.main,
        
        
          
        
          // Some CSS
        
        ,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Name of the slot
        root:  {
          fontSize: '0.875rem',
          // '.MuiOutlinedInput-notchedOutline':{
          //   borderColor: theme.palette.primary.light
          // },
          // '&:hover .MuiOutlinedInput-notchedOutline':{
          //   borderColor: theme.palette.primary.main
          // },
          '& fieldset':{
            borderWidth: '0.5px !important'
          },
          '&:hover fieldset':{
            borderWidth: '1px !important'
          },
          '&.Mui-focused fieldset':{
            borderWidth: '1px !important'
          },
        }
         
        ,
      },
    },
  },
})


export default theme