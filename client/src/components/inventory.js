import React, {Component} from 'react';
import axios from 'axios';
import { Button, Container, CssBaseline, TextField, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme } from '@mui/material/styles';

const useStyles = theme => ({
    paper: {
      marginTop: theme.spacing(12),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', 
      marginTop: theme.spacing(4),
    },
    submit: {
      margin: theme.spacing(3, 0, 3),
    },
});


const columns = [
  { field: '_id', headerName: 'id', width: 200 },
  { field: 'product', headerName: 'Product', width: 150 },
  { field: 'amount', headerName: 'Amount', width: 150 },
  { field: 'color', headerName: 'Color', width: 150 },

  { field: 'vendor', headerName: 'Vendor', width: 150 },
];

const deletedColumns = [
  { field: '_id', headerName: 'id', width: 200 },
  { field: 'comment', headerName: 'Comment', width: 150 },

  { field: 'product', headerName: 'Product', width: 150 },
  { field: 'amount', headerName: 'Amount', width: 150 },
  { field: 'color', headerName: 'Color', width: 150 },

  { field: 'vendor', headerName: 'Vendor', width: 150 },

];

class Inventory extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            id: '',
            idDelete: '',
            idArchive: '',
            product: '',
            productUpdate: '',
            amount: '',
            amountUpdate: '',
            vendor: '',
            vendorUpdate: '',
            colorUpdate: '',
            comment: '',
            inventory: [],
            archivedInventory: [],
            data: []
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    // Regular inventory
    componentDidMount() {
      axios.get("http://localhost:5000")
        .then(res => this.setState({inventory: res.data}))
        axios.get("http://localhost:5000/archived")
        .then(res => this.setState({archivedInventory: res.data}))
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(e.target.value);
    }
    onChange2 = (e) => {
      this.setState({ [e.target.name]: e.target.value });
      console.log(e.target.value);
  }
    onDropdownSelected = (e) => {
      console.log("THE VAL", e.target.value);
      this.setState({ [e.target.name]: e.target.value });
      //here you will see the current selected value of the select input
  }

    onSubmit(e) {
      console.log(e.nativeEvent.submitter.name)
        const inventory = {
            product: this.state.product,
            amount: this.state.amount,
            color: this.state.color,
            vendor: this.state.vendor
        }
        const updateInventory = {
          product: this.state.productUpdate,
          amount: this.state.amountUpdate,
          color: this.state.colorUpdate,
          vendor: this.state.vendorUpdate
      }

        const archivedSchema = {
          delete: true,
          comment: this.state.comment
        }

        console.log(inventory)

        if (e.nativeEvent.submitter.name === "add") {
          axios.post("http://localhost:5000/add", inventory)
            .then(res => console.log(res.data));
        }

        if (e.nativeEvent.submitter.name === "update") {
          console.log(e.nativeEvent.submitter.name)
          console.log('from frontend' + this.state.id)
          axios.patch("http://localhost:5000/"+this.state.id, updateInventory)
            .then(res => console.log(res.data));
        }

        if (e.nativeEvent.submitter.name === "delete"){
          axios.delete("http://localhost:5000/"+this.state.idUndelete, inventory)
            .then(res => console.log(res.data));
        }

        if (e.nativeEvent.submitter.name === "archive"){
          axios.post("http://localhost:5000/delete/"+this.state.idArchive, archivedSchema)
            .then(res => console.log(res.data));
        }
        if (e.nativeEvent.submitter.name === "undelete"){
          axios.post("http://localhost:5000/undelete/"+this.state.idUndelete, archivedSchema)
            .then(res => console.log(res.data));
        }
        // Need to add recover, and permanent delete

        axios.get("http://localhost:5000")
        .then(res => this.setState({inventory: res.data}))
    }


    render() {
        const { classes } = this.props
        const dropdown = this.state.inventory.map((item, i) => {
          return (
            <option key={i} value={this.state.id} onChange={this.onChange}>{item._id}</option>
          )
        }, this);
        return(
          <Container component="main" maxWidth="md">
            <div class = "center">
              <h1> Inventory Tracker </h1>
            </div>
            <div style={{ height: 400, width: '75%' }}>
                <DataGrid rows={this.state.inventory} columns={columns} />
              </div>
              
              <h2> Add Items</h2>
              <Grid item xs={8}>
                <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="product"
                        label="Product"
                        name="product"
                        autoFocus
                        value={this.state.product}
                        onChange={this.onChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="amount"
                        label="Amount"
                        name="amount"
                        value={this.state.amount}
                        onChange={this.onChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="color"
                        label="Color"
                        id="color"
                        value={this.state.color}
                        onChange={this.onChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="vendor"
                        label="Vendor"
                        type="vendor"
                        id="vendor"
                        value={this.state.vendor}
                        onChange={this.onChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Button
                        type="submit"
                        name="add"
                        variant="contained"
                        className={classes.submit}
                      >
                        Add Item
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              
              <div>
                <h2> Update Item</h2>
                <h4> Select the item that needs to be updated below</h4>
                <select name = "id" onChange={this.onDropdownSelected}>
                <option> - </option>
                {this.state.inventory.map((item, i) => {
          return (
            <option key={i}  value={item._id}>{item._id}</option>
          )
        })}
                 
                </select>
                <Grid item xs={8}>
                <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="product"
                        label="Product"
                        name="productUpdate"
                        value={this.state.productUpdate}
                        onChange={this.onChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="amount"
                        label="Amount"
                        name="amountUpdate"
                        value={this.state.amountUpdate}
                        onChange={this.onChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="colorUpdate"
                        label="Color"
                        id="color"
                        value={this.state.colorUpdate}
                        onChange={this.onChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="vendorUpdate"
                        label="Vendor"
                        type="vendor"
                        id="vendor"
                        value={this.state.vendorUpdate}
                        onChange={this.onChange}
                        required
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing = {2}>
                    
                    <Grid item xs={3}>
                      <Button
                        type="submit"
                        name="update"
                        variant="contained"
                        className={classes.submit}
                      >
                        Update Item
                      </Button>
                    </Grid>
                    {/* <Grid item xs={3}>
                      <Button
                        type="submit"
                        name="delete"
                        variant="contained"
                        className={classes.submit}
                      >
                        Delete Item
                      </Button>
                    </Grid> */}
                  </Grid>
                </form>
              </Grid>
              </div>
              <div>
                <h2> Delete Item</h2>
                <h4> Select the item id that needs to be deleted below</h4>
                <select name = "idArchive" onChange={this.onDropdownSelected}>
                <option> - </option>
                {this.state.inventory.map((item, i) => {
                  return (
                    <option key={i}  value={item._id}>{item._id}</option>
                  )
                })}
                 
                </select>
                <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                <Grid item xs={3}>
                <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="comment"
                        label="Comment"
                        type="comment"
                        id="comment"
                        value={this.state.comment}
                        onChange={this.onChange}
                      />
                    </Grid>
                      <Button
                        type="submit"
                        name="archive"
                        variant="contained"
                        className={classes.submit}
                      >
                        Delete Item
                      </Button>
                    </Grid>
                    </form>
              </div>
              <div class = "center">
              <h1> Archived Items </h1>
            </div>
            <div style={{ height: 400, width: '75%' }}>
                <DataGrid rows={this.state.archivedInventory} columns={deletedColumns} />
              </div>
              <div>
                <h2> Delete Item</h2>
                <h4> Select the item id that needs to be undeleted below</h4>
                <select name = "idUndelete" onChange={this.onDropdownSelected}>
                <option> - </option>
                {this.state.archivedInventory.map((item, i) => {
                  return (
                    <option key={i}  value={item._id}>{item._id}</option>
                  )
                })}
                 
                </select>
                <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={3}> 
                  <Button
                    color="primary"
                    type="submit"
                    name="undelete"
                    variant="contained"
                    className={classes.submit}
                  >
                    UnDelete Item
                  </Button>
                  </Grid>
                  <Grid item xs={3}>
                  <Button
                      color="secondary"
                        type="submit"
                        name="delete"
                        variant="contained"
                        className={classes.submit}
                      >
                        Permanent Delete
                      </Button>
                    </Grid>

                </Grid>
                
                      
                    </form>
              </div>
              
          </Container>
        )
    }
}

export default withStyles(useStyles)(Inventory);