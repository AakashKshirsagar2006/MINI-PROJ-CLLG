// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwindcss()],
// })


import { defineConfig } from 'vite'
import fs from 'fs';
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   server: {
    https: {
      key: fs.readFileSync('./SSL/server.key'),
      cert: fs.readFileSync('./SSL/server.cert')
    },
    port: 5173,
  }

})
