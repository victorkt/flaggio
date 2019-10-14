import React from 'react';
import './App.css';
import {gql} from "apollo-boost";
import {useMutation} from '@apollo/react-hooks';
import {FLAGS_QUERY} from './FlagsTable';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";

const CREATE_FLAG_QUERY = gql`
    mutation ($name: String!, $key: String!, $description:String){
        createFlag(input: {
            name: $name
            key: $key
            description: $description
        }) {
            id
            key
            name
            enabled
            createdAt
        }
    }
`;

const variantType = {
  BOOLEAN: 1,
  NUMBER: 2,
  STRING: 3,
};

function slugify(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/ /g, '.').toLowerCase();
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function NewFlagModal({open, handleClose}) {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [key, setKey] = React.useState('');
  const [description, setDescription] = React.useState(null);
  const [variantsType, setVariantsType] = React.useState(variantType.BOOLEAN);
  const [createFlag] = useMutation(CREATE_FLAG_QUERY, {
    update(cache, {data: {createFlag}}) {
      const {flags} = cache.readQuery({query: FLAGS_QUERY});
      cache.writeQuery({
        query: FLAGS_QUERY,
        data: {flags: flags.concat([createFlag])},
      });
    }
  });
  const inputLabel = React.useRef(null);
  const handleCreateFlag = () => {
    createFlag({
      variables: {
        name,
        key,
        description,
      }
    }).then(handleClose);
  };
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">New Flag</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" id="name" label="Name" type="text" fullWidth
                   onChange={e => {
                     const {value} = e.target;
                     setName(value);
                     setKey(slugify(value));
                   }}/>
        <TextField margin="dense" id="key" value={key} label="Key" type="text" fullWidth
                   onChange={e => setKey(e.target.value)}/>
        <TextField margin="dense" id="description" label="Description" type="text" fullWidth
                   onChange={e => setDescription(e.target.value)}/>

        <Divider/>

        <Typography variant="h6" id="variants">
          Variants
        </Typography>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
            Age
          </InputLabel>
          <Select
            value={variantsType}
            onChange={e => setVariantsType(e.target.value)}
            inputProps={{
              name: 'variantsType',
              id: 'variants-type',
            }}
          >
            {
              Object.keys(variantType).map(vt => (
                <MenuItem value={vt}>{vt}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateFlag} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewFlagModal;
