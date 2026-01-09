import { Container, Paper, Box, TextField, Typography, Button, Link } from "@mui/material"

export const LoginPageForm = () => {
   
    const handleSubmit = () => {
    return; 
  }

return (
<Container maxWidth="sm">
        <Paper sx={{padding: 2}}>
          <Typography component="h1" variant="h4" sx={{textAlign: "center"}}>Sign in</Typography>
          <Box
          component="form"
          onSubmit={handleSubmit}          
          >
            <TextField
              placeholder="Email"
              fullWidth
              required
              autoFocus
              sx={{ mb: 2}}
              >
            </TextField>
            <TextField 
              placeholder="Password"
              fullWidth
              required
              sx={{ mb: 2}}              
              >
            </TextField>
            <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
              <Button
                type="submit"
                
                >Sign in</Button>
              <Link>Forgot password?</Link>
            </Box>
          </Box>
        </Paper>
      </Container>
)
}