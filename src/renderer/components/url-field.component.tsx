import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

type UrlFieldType = {
  url: string,
}

export default function UrlField({url}: UrlFieldType) {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 360 }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder=""
        inputProps={{ 'aria-label': 'search google maps' }}
        name = "UrlField"
        value = {url}
      />
    </Paper>
  );
}
