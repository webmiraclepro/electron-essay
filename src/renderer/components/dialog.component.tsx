import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';

interface ConfirmDialogProps {
  handleOkDlg: () => void;
  closeDialog: (isOpen: boolean) => void;
  open: boolean;
  content: string;
}

export default function ConfirmDialog (props: ConfirmDialogProps) {
	
  const handleCancel = () => {
     props.closeDialog(false)
	};

	const handleOk = () => {
		props.handleOkDlg()
	}

  return (
	<Dialog
	    open={props.open}
	    onClose = {handleCancel}
	    aria-labelledby="alert-dialog-title"
	    aria-describedby="alert-dialog-description"

	  >
	    <DialogTitle id="alert-dialog-title">
	      {"Confirmation"}
	    </DialogTitle>
	    <DialogContent>
	      <DialogContentText id="alert-dialog-description">
	       {props.content}
	      </DialogContentText>
	    </DialogContent>
	    <DialogActions>
	      <IconButton autoFocus onClick={handleCancel}>
          	<ClearIcon/>
	      </IconButton>
	      <IconButton onClick={handleOk}>
	      	<DoneIcon/>
	      </IconButton>
	    </DialogActions>
	  </Dialog>
	)
}



          
