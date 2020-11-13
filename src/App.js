import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    // create three state variables.
    // apiData is an array to hold our JSON data
    // isFetched indicates if the API call has finished
    // errorMsg is either null (none) or there is some error
    this.state = {
      apiData: [],
      isFetched: false,
      errorMsg: null
    };
  }
  // componentDidMount() is invoked immediately after a
  // component is mounted (inserted into the tree)

  async componentDidMount() {
    try {
      const API_URL =
        "https://raw.githubusercontent.com/petermooney/cs385/main/stockapi/stocks30.json";
      // Fetch or access the service at the API_URL address
      const response = await fetch(API_URL);
      // wait for the response. When it arrives, store the JSON version
      // of the response in this variable.
      const jsonResult = await response.json();

      // update the state variables correctly.
      this.setState({ apiData: jsonResult.stockData });
      this.setState({ isFetched: true });
    } catch (error) {
      // In the case of an error ...
      this.setState({ isFetched: false });
      // This will be used to display error message.
      this.setState({ errorMsg: error });
    } // end of try catch
  } // end of componentDidMount()

  // Remember our three state variables.
  // PAY ATTENTION to the JSON returned. We need to be able to
  // access specific properties from the JSON returned.
  // Notice that this time we have three possible returns for our
  // render. This is conditional rendering based on some conditions

  portfolioSize() {
    if (this.state.apiData.length >= 100 && this.state.apiData.length < 200) {
      return <h2>Large Stock Portfolio</h2>;
    } else if (this.state.apiData.length >= 200) {
      return <h2>Very Large Stock Portfolio</h2>;
    }
  }

  /* sorting by the timestamp of the stock objects */
  /* This sort comparison method will sort in DESCENDING
  chronological order. NOTE how the timestamp property is accessed.
  */
  sortByTimestamp(stockA, stockB) {
    let comparison = 0;

    // use Date.parse from Javascript.
    // This will take the timestamp such as 2024-12-26 08:43:15
    // and convert it to numeric form. This allows us then to
    // perform comparisons.
    // check https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
    let stockADate = Date.parse(stockA.rates.timestamp);
    let stockBDate = Date.parse(stockB.rates.timestamp);

    if (stockADate > stockBDate) comparison = -1;
    else if (stockADate < stockBDate) comparison = 1;
    else comparison = 0;

    return comparison;
  }

  render() {
    if (this.state.errorMsg) {
      return (
        <div className="container">
          <div className="error">
            <h1>We're very sorry: An error has occured in the API call</h1>

            <p>The error message is: {this.state.errorMsg.toString()}</p>
          </div>
        </div>
      ); // end of return.
    } else if (this.state.isFetched === false) {
      return (
        <div className="fetching">
          <h1>We are loading your API request........</h1>
          <p>Your data will be here very soon....</p>
        </div>
      ); // end of return
    } else {
      // we have no errors and we have data
      return (
        <div className="App">
          <div className="container">
            <div className="StocksTable">
              {this.portfolioSize()}
              <h1>CS385 - Stocks API Display ({this.state.apiData.length})</h1>
              <table
                className="table table-striped table-sm table-bordered"
                border="1"
              >
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Industry</th>
                    <th>Sector</th>
                    <th>Buy</th>
                    <th>Sell</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.apiData.sort(this.sortByTimestamp()).map((s) => (
                    <tr key={s.stockID}>
                      <td>{s.stockID}</td>
                      <td>{s.stock.name}</td>
                      <td>{s.stock.symbol}</td>
                      <td>{s.stock.industry}</td>
                      <td>{s.stock.sector}</td>
                      <td>{s.rates.buy}</td>
                      <td>{s.rates.sell}</td>
                      <td>{s.rates.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ); // end of return
    } // end of the else statement.
  } // end of render()
} // end of App class
export default App;
