import {configureStore} from "@reduxjs/toolkit";

const store = configureStore({
  reducer: (state, action) => {
    switch(action.type) {
      case "Moved": {
        console.log("Moved");
        break;
      }
      case "Looked": {
        console.log("Looked")
      }
    }

    return state
  }
})

export default store
