import React, { Component } from 'react';
import './index.css';


const products = [{name: 'Pepperoni', price:19.00, index:0, selected:false}, 
{name: 'Cheese', price:20.01, index:1, selected:false},
{name: 'Special Flavour', price:11.29, index:2, selected:false},
{name: 'Mega Meat', price:21.29, index:3, selected:false},
{name: 'Vegetarian', price:12.64, index:4, selected:false},
{name: 'Ground Beef', price:39.99, index:5, selected:false},
{name: 'Calzone', price:9.99, index:6, selected:false}
];


class App extends Component {
  constructor(props){
      super(props);
  
  this.state = {
    products: this.props.products,
    addedProducts: [],
    newName: products[0].name,
    newQuantity: 1,
    price: products[0].price,
    total: 0
}

    this.handleSelectChange=this.handleSelectChange.bind(this);
    this.handleQuantityChange=this.handleQuantityChange.bind(this);
    this.handleAddClick=this.handleAddClick.bind(this);
    this.clearAll=this.clearAll.bind(this);
    this.addDiscount=this.addDiscount.bind(this);

  }


  handlePromoChange (event) {
    /* Your code here */
  };

  handleSelectChange (event) {
        //capture product name
        const name = event.target.value;
        //create two array: one for product names and one for product prices
        const productNames=Object.values(products).map( product => product.name )
        const productPrices=Object.values(products).map( product => product.price )
        
        //grab the index of the product name to find corresponding product price
        const index = productNames.indexOf(name);
        //gives corresponding price for selected product name
        const price = productPrices[index];

//set state for both name and price. Must be done at same time!
  this.setState({
        newName: name,
        // newQuantity:this.state.newQuantity,
        price:price
    });

}

  handleQuantityChange (event) {
    const quantity = Number(event.target.value);
    
     this.setState({
       newQuantity:quantity
     });

  };

  handleAddClick (e) {
    e.preventDefault();
    
    //copy of addedProducts (array of objects)
    let array = this.state.addedProducts;
    //create an array of only the product names in addedProducts
    const arrayNames=Object.values(array).map(item => item.name);
    


if (arrayNames.length === 0){
            array.push({name:this.state.newName, 
                        quantity: this.state.newQuantity, 
                        price: this.state.price,
                        subtotal:this.state.newQuantity*this.state.price});
                        
                        //handles rounding to two decimal places
                        // array[0].subtotal.toFixed(2);
                      
                        this.setState({
                                addedProducts: array,
                                // total:array[0].subtotal.toFixed(2)
                                total:array[0].subtotal.toFixed(2)
                        }) 
}


//check to see if this.state.newName already exists in this.state.addedProducts

if (arrayNames.length > 0){

//if product name does not yet exist in the array
    if (arrayNames.indexOf(this.state.newName) === -1){
        array.push({name:this.state.newName, 
                        quantity: this.state.newQuantity, 
                        price: this.state.price, 
                        subtotal:(this.state.newQuantity*this.state.price)});

//create an array of just the subtotals from array (copy of addedProducts)
        const arrayPrices = Object.values(array).map( item => item.subtotal );   
        console.log(arrayPrices);    
//use .reduce to add up all the prices to get Total.
        let total = arrayPrices.reduce(function (a, b){
            return a + b;
            
        })

        // let roundTotal = Math.round(total * 100)/100;

                        this.setState({
                                addedProducts: array,
                                total:total.toFixed(2)
                            }) 

                          
  
        }
//if product name already exists in the array
let oldTotal = this.state.total;

if (arrayNames.indexOf(this.state.newName) !== -1){
for(let i = 0; i < array.length; i ++){    
     if (this.state.newName === array[i].name){
                    
                    array[i].quantity = this.state.newQuantity + array[i].quantity;
                    array[i].subtotal = this.state.price * array[i].quantity;      

                    }
                  
                    let total = Number(this.state.newQuantity*this.state.price) + Number(oldTotal);
                   
                  
                        this.setState({
                            addedProducts:array,
                            total: total.toFixed(2)
                        })
            }
        }
    } 
}     
  
  clearAll(e){
      e.preventDefault();
      this.setState({
          addedProducts:[],
          newQuantity: 1,
          total: 0
      })

  }

  addDiscount(event){
      const promoCode = event.target.value;
      let total = this.state.total*0.85;
      let roundTotal = Math.round(total*100)/100;

      if (promoCode === "prom15"){
         this.setState({
             total: roundTotal.toFixed(2)
         })
       
      }
  }
 

  render() {

    return (
      <div>
            <h1 className="header">just eat a delicious pizza</h1>

            <AddProduct 
            //returns an array of property values in object "product"
                products={Object.values(products)}
                handleAddClick={this.handleAddClick} 
                handleSelectChange={this.handleSelectChange}
                handleQuantityChange={this.handleQuantityChange}
                handleAddProduct={this.handleAddProduct}
                clearAll={this.clearAll}
                getPrice={this.getPrice}
                newQuantity={this.state.newQuantity}

            />
        
            <DisplayTable
                addedProducts={this.state.addedProducts}
            />

            <PromoCode 
                 addDiscount={this.addDiscount}
            />

            <Total
                total={this.state.total}
            />

       </div>
      )
  }
}

class AddProduct extends Component {


render() {

   
    const optionArray = products.map((item) => {
            return (<option value={item.name} key={item.index}>{item.name}</option>) 
    })

      //shorthand for products = this.props.products
            //  const { products } = this.props;

    return (
      <div className='add-product'>

            <form onSubmit={this.props.handleAddClick}>

                <select onChange={this.props.handleSelectChange}> 
                
                    {optionArray}
                        

                </select>


                <input type="number" min="1" placeholder="Quantity" className='quantity' 
                    onChange={this.props.handleQuantityChange}></input>
                
                <button className='add'> Add </button>
                 <button className='add' onClick={this.props.clearAll}> Clear All </button>

            </form>

      {this.props.tagline}
      </div>
    )
    
  }
  
}

/* <OrderTable> renders the table and thead tags */
/* Do not change */
class DisplayTable extends Component {


    render(){
       const renderedProducts = this.props.addedProducts.map((item, i) => {
                return  ( <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>${item.subtotal.toFixed(2)}</td>
                        </tr>)
})
 
        return(
              <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                     <tbody>
                        {renderedProducts}
                        <tr>
                     <td></td>
                     </tr>
                     </tbody>
                     </table>

        )
    }
}

class PromoCode extends Component {
//  - if the user enters the code PROMO10, a promotional discount of 10% should be applied to product subtotals

    render(){
        return(
          
                    <div>
                    <input type="text" onChange={this.props.addDiscount} placeholder="Enter Promo Code Here"></input>
                    </div>
                )
                
        
    }
}

class Total extends Component {
    render (){
        return(
               <div className="total">
                Total: ${this.props.total}
               </div>

        )
    }
}

export default App;

