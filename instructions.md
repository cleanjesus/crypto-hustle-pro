Stretch Features
Step 5: Create chart for coin price over time using Recharts

In this step, we'll create a cool price over time chart for each coin's DetailView.

Make a new CoinChart.jsx component file in your Components folder.

For this component, we will need the symbol for each coin and market, which we can pass in using the information we pulled from CoinDetail. That component will look something like:
import { useEffect, useState } from "react"
const API_KEY = import.meta.env.VITE_APP_API_KEY

const CoinChart = ({ symbol, market }) => {
const [histData, setHistData] = useState(null)

      return (
        <div>
          {histData ? (// rendering only if API call actually returned us data
            <div>

            </div>
          ) : null}
        </div>
      )

}

export default CoinChart
We will be making another API call in this file, so that we can get historical price data for a symbol and use it to plot out some data points.

Create another useEffect() hook to make these fetch calls.
Inside of that useEffect() hook, create a function called getCoinHist() to get the 30 day historical price data in USD and in the relevant market for each coin.
Make sure the read the docs for this API call to understand everything that goes into it and what it returns!
AI opportunity

Use AI as a pair programming partner → AI as Driver
Need some help? Ask Copilot to help you write this function. Break down what you need to do into steps, and ask it to write the code for each step. If the code it gives you makes sense, add it to your code and test it.

Want to double-check your code? Compare what you have to this ⤵️
useEffect(() => {
const getCoinHist = async () => {
const response = await fetch(
`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&e=${market}&limit=30&api_key=` +
API_KEY
)

    const json = await response.json()
    setHistData(json.Data.Data)

}
getCoinHist().catch(console.error)
}, [market, symbol])
From there, we know that our data returned in getCoinHist() is given in an odd way (read the docs and play around with the sample query tool to find out more!), so we need to clean it up. The time series data is also returned as a snapshot of each price each day 30 times (to represent the 30 days back we wanted to go), so we need to assign each of our data points to real dates and times so they make sense on our chart.

The getCoinHist() function fetches 30 days of historical price data for the selected coin from the CryptoCompare API. However, the API returns this data as an array of daily snapshots, each with a timestamp in seconds. To make this data meaningful for our chart, we need to create a function to process each data point, converting the timestamp into a readable date string. This ensures that each point on the chart is accurately labeled with its corresponding date, making the time series easy to interpret.

Create a separate function to clean up the data and do the Date math.
const cleanData = (data) => {
let filteredData = []
let countDays = 0
for (const item of data) {
let accurateDay = new Date()
accurateDay.setDate(accurateDay.getDate() - countDays)

    filteredData.push({
      'time': accurateDay.toLocaleDateString("en-US"),
      'open price': item.open,
    })
    countDays++

}

// data is given counting backwards, so return the reverse to have data ordered from oldest to newest for accurate plotting
return filteredData.reverse()  
}
AI opportunity

Use AI to understand provided code → "Explain this" with Copilot
Have questions about any part of this code? Highlight and right-click the code, then choose Copilot > Explain this to get an explanation.

Lastly, we need to plot our actual data, using Recharts. Look at the documentation here and try to find the best ways to display this data.
AI opportunity

Use AI to explain code concepts → Recharts
Ask Copilot for some example code using Recharts. For example, try asking for an example of a line chart using Recharts and ask it to explain how the code works.

You have creative freedom here! You can use whatever kind of line charts with whatever embellishments on the data points or chart background. Just make sure that each axis is labeled, there is a title to the graph, and the data points are clearly marked.

Reminder: Anything you use from Recharts needs to be imported at the top of the file!
If you would like, use the example code as a starting point... ⤵️
Inside of the return() statement:

<div>
  <br></br>
  <h2>30-Day Price Data for {symbol}</h2>

<LineChart
width={1300}
height={400}
data={cleanData(histData)}
margin={{
        top: 10,
        right: 30,
        left: 20,
        bottom: 30,
    }}

> <Line

      type="monotone"
      dataKey="open price"
      stroke="#8884d8"
      activeDot={{ r: 5 }}

/>
<CartesianGrid strokeDasharray="5 5" />
<XAxis dataKey="time" interval={2} angle={20} dy={5}>
<Label value="Date and Time" offset={0} position="insideBottom" dy={50}/>
</XAxis>

<YAxis
label={{
      value: "Price",
      angle: -90,
      position: "insideLeft",
      textAnchor: "middle",
      dx: -18
      }}
/>
<Tooltip />
</LineChart>

</div>
And here are the imports at the top of the file:

import {
LineChart,
Line,
CartesianGrid,
XAxis,
YAxis,
Tooltip,
Label
} from "recharts"
Finally, you will need to add your CoinChart to the bottom of your CoinDetail. Make sure to pass in the values that you need.

At the top of CoinDetail.jsx, import CoinChart.
import CoinChart from "./CoinChart"

Below all of the detailed information in your table, add a CoinChart component. Pass symbol for its symbol prop and fullDetails.numbers[symbol].USD.MARKET for its market prop.
<CoinChart
  symbol={symbol}
  market={fullDetails.numbers[symbol].USD.MARKET}
/>
And you are done! Add any CSS rules that you would like to finish up this stretch goal!

📍 Checkpoint 5: At the end of this step, you should have a nice little chart of price data over a 30 day period that you grabbed with an API and then plotted with recharts.

Screenshot of app with base features implemented

Extra Stretch Feature!

Step 6: Performance Improvement: Stop CoinInfo API calls when moving to another page

In this step, we'll deal with a potential performance issue. Because there are so many coins that we have to handle and get price information for in our home page, if we try to see the detail view for a coin before all of the coins in our list have rendered their price information (from our CoinInfo component), then we will just see a blank screen for a while. We need to add some functionality to abort our price API calls when we move to another page.

To do this, we need to add something called an AbortController in our CoinInfo component.

If you would like to read up on it, here is some documentation: AbortController. It allows you to stop web requests (in our case, API calls) on demand.

AI opportunity

Use AI to explain code concepts → AbortController
In our case, we want to stop all running and queued API calls when we navigate to another page (aka go to a detail view). Another way we can think of going to another page is that we are unmounting the component on the home page, so the App and CoinInfo components. Handling a component mounting and unmounting is up to the useEffect() hook in our case, so our changes will go there.

In the useEffect() hook in CoinInfo.jsx, create a new AbortController before the getCoinPrice() function.
const controller = new AbortController()

Inside of our fetch() call in getCoinPrice(), we will need to edit our call to look like the line below so that our controller will look out for any cancel signals and know what calls to stop.
const response = await fetch(
`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=` + API_KEY,
{ signal: controller.signal }
)

We also need to add a function statement so if our component unmounts, the rest of the API calls abort. At the end of the useEffect() hook, below the call to getCoinPrice(), call the abort() function on the AbortController:
return () => controller.abort()
The AbortController will throw an error whenever a request is aborted. However, we don't actually care about these errors since we are making them on purpose, so we will need a try/catch block when we call our API. This way, we can ignore any incoming AbortErrors, but still log other errors to the console.

If we do not have any logic to ignore the AbortError, whenever we navigate to a new page quickly we could see up to 600 AbortErrors flooding the console, which will drown out any other errors that may also be logged to the console.

Modify the getCoinPrice() function to put the current code inside of a try block.

After the try block, place a catch(error) block. Here is what our catch block will look like:
catch (error) {
if (error.name === "AbortError") {
// It's ok, don't do anything
} else {
console.error(error)
}
}
And you are done!

Here is what our new useEffect() hook will look like for aborting API calls... ⤵️
useEffect(() => {

const controller = new AbortController()

const getCoinPrice = async () => {
try {
const response = await fetch(
`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=` +
API_KEY,
{ signal: controller.signal }
)
const json = await response.json()
setPrice(json)
} catch (error) {
if (error.name === "AbortError") {
// It's ok, don't do anything
} else {
console.error(error)
}
}

}

getCoinPrice()
return () => controller.abort()

}, [symbol])
📍 Checkpoint 6: There is no visual change at this point, you should be able to notice that if you click on a coin to bring up it's detail view fairly quickly after the list appears, where you can assume coins near the bottom are still loading (or you can inspect the page and check the network tab to see that price API calls are still being made), that the page should instantly switch and pull up the detail view fairly quickly. There will be less lag than before and it will make your web app that much more seamless 🥳

🎉 Congratulations 🎉
You've completed the lab AND stretch goals! 🚀
💡 Tip: Remember to come back and reference this lab when you need to do similar things in your project!
