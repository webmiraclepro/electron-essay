import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Tooltip from '@mui/material/Tooltip';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css'; 
import UrlList from "./checkboxlist.component";
import UrlField from "./url-field.component";
import "../mycss/board-user.css";
import idb from '../services/indexeddb-service'
import { IDB_CONFIGS } from '../constants/idbconfig'
import AuthService from "../services/auth.service";
import GoogleIcon from "../../../assets/google.jpg";
import ConfirmDialog from "./dialog.component"

declare global {
    interface Window { electron: any; }
}

const BoardUser = () => {
  const [url, setUrl] = useState('');
  const [preloadPath, setPreloadPath] = useState('');
  const [domRemoveMode, setDomRemoveMode] = useState(false);
  const [savedElements, setSavedElements] = useState([]);
  const [savedSettings, setSavedSettings] = useState({});
  const [urlList, setUrlList] = useState([]);
  const [blocking, setBlocking] = useState(false)
  const [isloadUrl, setIsLoadUrl] = useState(false)
  const [isgotoGoogle, setIsGotoGoogle] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const webview: any = document.getElementById("webview");
  
  const clearData = () => {
    idb.deleteStoreData(IDB_CONFIGS.tableNames[0]).then(function(result) {
      console.log(result)
      getAllList()
    })
  }
  const exportFile = () => {
    console.log('export file')
    idb.getAllValue(IDB_CONFIGS.tableNames[0]).then(function(result) {
        const user = AuthService.getCurrentUser();
        result.push({'username': user.value.username})
        window.electron.showSaveDialog(result);
      }).catch(e=> {
        console.log(e)
    })
  }

  const importFile = async () => {
    console.log('importFile')
    const result = await window.electron.showOpenDialog()
    idb.putBulkValue(IDB_CONFIGS.tableNames[0], JSON.parse(result)).then(function() {
      getAllList()
    })
  }

  const addUrl = () => {
    const result = {
      'url': url,
      'savedElements': savedElements,
      'settings': savedSettings
    }
    idb.getAllValue(IDB_CONFIGS.tableNames[0]).then(function(allValue) {
      for(const value of allValue) {
        if(value.url == url) {
          console.log('The same url already exists!')
          idb.deleteValue(IDB_CONFIGS.tableNames[0], value.id);
          break;
        }
      }
      idb.putValue(IDB_CONFIGS.tableNames[0], result).then(function() {
        getAllList()
      })
      
    })
  }

  const loadUrl = (loadurl: string) => {

    setIsGotoGoogle(false)
    setIsLoadUrl(!isloadUrl)
  
    if(url == loadurl) {
       try {
        webview?.reload()
       } catch(error) {
        console.log(error)
       }
    }
    webview?.loadURL(loadurl).catch((error: any) => { if (error.code === 'ERR_ABORTED') return; throw error; });
    setUrl(loadurl)
  }

  const deleteUrl = (deleteid: number) => {
    idb.deleteValue(IDB_CONFIGS.tableNames[0], deleteid).then(function() {
      getAllList()
      gotoGoogle()
    })
  }

  const loadHiddenElements = () => {
    console.log('loadHiddenElements--------------------')
    let loadData: any;
    idb.getAllValue(IDB_CONFIGS.tableNames[0]).then(function(results) {
      for(const result of results) {
        if(result.url == url) {
          loadData = result;
          break;
        }
      }
      if(loadData) {
        // webview?.executeJavaScript(`window.load(${loadData})`)
        webview?.send('load_hiddenElements', loadData)
      }
   })
  }

  const undoWebView = () => {
    webview?.goBack()
  }

  const redoWebView = () => {
    webview?.goForward()
  }

  const gotoGoogle = () => {
    setIsGotoGoogle(true)
    console.log('gotoGoogle')
    webview?.loadURL("https://www.google.com").catch((error: any) => { 
      if (error.code === 'ERR_ABORTED') return;
      throw error; 
    });
    // refresh();
    webview?.clearHistory();
  }

  const refresh = () => {
    webview?.send('refresh-webview')
  }

  const getAllList = () => {
    idb.getAllValue(IDB_CONFIGS.tableNames[0]).then(function(result) {
        setUrlList(result) 
      }).catch(e=> {
        console.log(e)
    })
  }
  
  useEffect(() => {
    const webview: any = document.getElementById("webview");
    console.log('didmount')
    webview?.addEventListener('did-attach', () => {
      let isAttach = false;
      if(isAttach) {
        return;
      }
      isAttach = true;
      
      webview?.openDevTools()
      console.log("did-attach")

      getAllList()
      webview?.addEventListener('ipc-message', (event: any) => {
        const {args,channel} = event;
        console.log(channel)
        switch (channel) {
          // case 'set_domRemoveMode_to_false': setDomRemoveMode(false); break;
          case 'activate_domRemoveMode': console.log('activate'); break;
          case 'deactivate_domRemoveMode': console.log('deactivate'); break;
          case 'save_hiddenElements': setSavedElements(args[0]);  break;
          case 'save_settings': setSavedSettings(args[0]);  break;
          default: break;
        }
      })
    })
    const preloadPath = window.electron.ipcRenderer.getPreloadPath()
    // const preloadPath = window.electron.getPreloadPath();
    setPreloadPath(preloadPath)
  }, [])

  const openGoogleDlg = () => {
    setIsGotoGoogle(true);
    setOpenDialog(true);
  }

  const openClearDlg = () => {
    setIsGotoGoogle(false);
    setOpenDialog(true); 
  }

  const handleChangeDlg = () => {
    if(isgotoGoogle) {
      gotoGoogle()
      setOpenDialog(false)
    } else {
      clearData()
      setOpenDialog(false)
    }
  }
  
  useEffect(() => {
    
    webview?.addEventListener('dom-ready', () => {
      const guestUrl = webview.getURL()
      setUrl(guestUrl)
    })
    webview?.addEventListener('did-start-loading', () => {
      console.log('did-start-loading')
      setBlocking(true)
    })
    webview?.addEventListener('did-finish-load', () => {
      console.log('did-finish-load')
      setBlocking(false)
    })
    webview?.addEventListener('did-stop-loading', () => {
      console.log('did-stop-loading')
      setBlocking(false)
    })

    webview?.addEventListener('did-fail-load',() => {
      console.log('did-fail-load')
      setBlocking(false)
      alert('check net Status')
    })

  }, [webview])

  useEffect(() => {
    if(domRemoveMode) {
      webview?.send('activate_domRemoveMode')
    } else {
      webview?.send('deactivate_domRemoveMode')
    }
  }, [domRemoveMode])

  useEffect(() => {
    webview?.addEventListener('dom-ready',() => {
        loadHiddenElements()
    })
  }, [isloadUrl])

    return (
        <Box sx={{ flexGrow:1 }}>
          <Grid 
            container spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Tooltip title="Delete all urls">
                <IconButton sx={{ p: '10px' }} >
                  <DeleteSweepOutlinedIcon onClick = {openClearDlg}/>
                </IconButton>
              </Tooltip>
            </Grid>
          
            
            <Grid item>
              <Tooltip title="Export file">
                <IconButton sx={{ p: '10px' }} >
                  <FileUploadOutlinedIcon onClick = {exportFile}/>
                </IconButton>
              </Tooltip>
            </Grid>
            
            
            <Grid item>
              <Tooltip title="Import file">
                <IconButton sx={{ p: '10px' }} >
                  <FileDownloadOutlinedIcon onClick = {importFile}/>
                </IconButton>
              </Tooltip>
            </Grid>
           
            <Grid item style={{padding:'10px'}}>
              <UrlField url = {url} />
            </Grid>
            <Grid item>
              <Tooltip title="Save url">
                <IconButton sx={{ p: '10px' }} aria-label="addurl" disabled = {domRemoveMode}>
                  <SaveOutlinedIcon color = {domRemoveMode?'disabled':'action'} onClick = {addUrl}/>
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={domRemoveMode?"Deactivate domRemoveMode" :"Activate domRemoveMode"}>
                <IconButton sx={{ p: '10px' }} aria-label="search" onClick = {() => {setDomRemoveMode(!domRemoveMode)}}>
                  <TouchAppOutlinedIcon color = {domRemoveMode?"primary":"action"} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Refresh initial url">
                <IconButton sx={{ p: '10px' }} onClick = {refresh} >
                  <RefreshOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Undo url">
                <IconButton onClick = {undoWebView}>
                  <UndoOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Grid>
             <Grid item>
               <Tooltip title='Redo url'>
                <IconButton onClick = {redoWebView}>
                  <RedoOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title='Go to Google'>
                <IconButton style = {{float: 'right'}} onClick = {openGoogleDlg}>
                  {/*<GoogleIcon/>*/}
                  <img src = {GoogleIcon} alt="gotoGoogle" style = {{width: "25%",float: 'right'}} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={4}>
              <UrlList urlList = {urlList} onloadUrl = {loadUrl} ondeleteUrl = {deleteUrl}/>
            </Grid>
            <Grid item xs={8}>
              <BlockUi tag = 'div' message = 'Loading' blocking = {blocking} keepInView = {true}>
                <webview id="webview" src="https://www.google.com" preload = { preloadPath } style={{ padding: '10px', width: "100%", height:'80vh'}}>
                </webview>
              </BlockUi>
            </Grid>
          </Grid>
          <ConfirmDialog 
            content = {isgotoGoogle?"Do you want to go to Google?":"Do you want to delete all urls?"}
            open = {openDialog} 
            closeDialog = {(isOpen: boolean) => {setOpenDialog(isOpen)}}
            handleOkDlg = {handleChangeDlg}
           />
        </Box>
    );
}

export default BoardUser;
