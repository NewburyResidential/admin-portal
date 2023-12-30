'use client';

import Typography  from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"

import { alpha } from "@mui/material";

export default function View({user}) {
    const firstName = user?.name?.split(' ')[0];
  return (
    <Container>
    <Typography variant="h4">Hi {firstName}, Welcome To Newbury&apos;s Admin Portal!</Typography>

    <Box
      sx={{
        mt: 5,
        width: 1,
        height: 320,
        borderRadius: 2,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        border: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
 <Box sx={{ p: 3 }}>
  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
    <strong>Permissions:</strong>
  </Typography>
  <List>
    <ListItem>
      <ListItemText primary="You have permissions to view &quot;Transactions&quot; and &quot;Reports&quot; under the Management Tab." />
    </ListItem>
  </List>
</Box>
<Box sx={{ px: 3, backgroundColor: '#f9f9f9' }}>
  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
    <strong>Display Settings:</strong>
  </Typography>
  <List>
    <ListItem>
      <ListItemText primary="Adjust your preferences in the settings tab." />
    </ListItem>
    <ListItem>
      <ListItemText primary="Change your theme, layout or enter dark mode" />
    </ListItem>
    <ListItem>
      <ListItemText primary="Enter or exit fullscreen mode" />
    </ListItem>
  </List>
</Box>
    </Box>
  </Container>
  )
}