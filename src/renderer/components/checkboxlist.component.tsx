import {useState, useEffect} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QuickSearchToolbar from './quicksearch.component'
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

type CheckboxListType = {
  urlList: Array<object>,
  onloadUrl: (url: string) => void,
  ondeleteUrl: (id: number) => void,
}

export default function CheckboxList({urlList, onloadUrl, ondeleteUrl}: CheckboxListType) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [deletedId, setDeletedId] = useState(-1);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<any[]>(urlList)

  const handleCloseCancel = () => {
    setOpen(false);
  };

  const handleCloseOk = () => {
    setOpen(false)
    ondeleteUrl(deletedId)
  }

  const deleteSelectedUrl = (id:number) => () => {
    setOpen(true);
    setDeletedId(id)
  }

  const handleList = (url: string, id: number) => () => {
    setSelectedIndex(id);
    onloadUrl(url);
  }

  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredUrlList = urlList.filter((val: any) => {
      return Object.keys(val).some((field:any) => {
        return searchRegex.test(val[field].toString())
      })
    })
    setData(filteredUrlList)
    
  }

  const truncate = (str: string, n: number) => {
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
  };

  useEffect(()=>{
      setData(urlList)
  }, [urlList])

  return (
    <div>
      <QuickSearchToolbar 
        value = {searchText}
        onChange = {(event: any) => requestSearch(event.target.value)}
        clearSearch = {() => requestSearch('')}
      />
      <List sx={{ 
        width: '100%', 
        maxWidth: 360, 
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: '80vh', 
      }}>
        {data.length === 0 && <ListItemText primary={"No lists!"}/>}
        {data.map((value:any) => {
          const labelId = `checkbox-list-label-${value.id}`;
          const truncateUrl = truncate(value.url, 35)
          
          return (
            
            <ListItem
              key={value.id}
              secondaryAction={
                <Tooltip title='Delete selected url'>
                  <IconButton edge="end" aria-label="comments" onClick = {deleteSelectedUrl(value.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              }
              disablePadding
              button = {true}
              dense = {true}
              selected = {selectedIndex === value.id}
            >
            <Tooltip title = {value.url}>
              <ListItemButton role={undefined} onClick={handleList(value.url, value.id)} dense>
                <ListItemText id={labelId} primary={truncateUrl}/>
              </ListItemButton>
            </Tooltip>   
            </ListItem>
            
          );
        })}
       <Dialog
          open={open}
          onClose = {handleCloseCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirmation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure to remove?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <IconButton onClick={handleCloseCancel}>
              <ClearIcon/>
            </IconButton>
            <IconButton onClick={handleCloseOk} autoFocus>
             <DoneIcon />
            </IconButton>
          </DialogActions>
        </Dialog>
      </List>
    </div>
  );
}