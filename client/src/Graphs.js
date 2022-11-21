import React, {useEffect, useRef, useState} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Graphs.css'

const heat = require('highcharts/modules/heatmap');
heat(Highcharts);

export /* class */ function ScatterPlot(props) /* extends React.Component */ {
    /* constructor(props) {
        super(props);
    } */
    const [stateData, setStateData] = useState({})
    const [linepoints, setLinePoints] = useState([])
    const [slope, setSlope] = useState();
    const [yint, setYint] = useState();
    const {data, height} = props;
    const [graphData, setGraphData] = useState();

    function grabData(obj){
        let ret = {}
        let cap = 0;
        try{cap = obj.PNODE_NAME.length}catch{cap = 0}

        let n = cap;
        let sumxy = 0;
        let sumx = 0;
        let sumy = 0;
        let sumxsqure = 0
        let minx = Infinity;
        let maxx = -Infinity;

        let entered = false;
        for(let i = 0; i < cap; i++){
            let index = obj["PNODE_NAME"][i].toString() + obj["PERIOD_ID"][i].toString();
            if(!ret.hasOwnProperty(index)){ret[index] = {x: null, y: null, z: obj["PNODE_NAME"][i], time: new Date(obj["PERIOD_ID"][i]).getTime(), yset: false}}
            if(obj["SCENARIO_ID"][i] === '1') {
                ret[index].x = parseFloat(obj["LMP"][i])
                ret[index].y = parseFloat(obj["LMP"][i])

                minx = Math.min(minx, ret[index].x)
                maxx = Math.max(maxx, ret[index].x)

                sumx += ret[index].x;
                sumxsqure += (ret[index].x * ret[index].x);
            }
            else {
                ret[index].y = parseFloat(obj["LMP"][i])
                ret[index].yset = true;
                entered=true;
                sumy += ret[index].y;
            }
            if(ret[index].x !== null && ret[index].yset){
                sumxy += ret[index].x * ret[index].y;
            }
        }

        ret = Object.values(ret)

        let points = [[minx,minx],[maxx,maxx]]
        
        if(!entered){
            setSlope(1)
            setYint(0)
        }else{
            let slope = ((n * sumxy) - (sumx * sumy)) / ((n * sumxsqure) - (sumx * sumx))
            let yinter = (sumy / n) - (slope * (sumx / n))

            function getPoint(xval){
                return {x: xval, y: (xval*slope+yinter) }
            }
            setYint(yinter);
            setSlope(slope);
            points = [getPoint(minx), getPoint(maxx)];
        }
        
        return [ret, points];
    }

    useEffect(() => {
        setStateData(data)
    }, [data])

    useEffect(() => {
        const grab = grabData(stateData)

        setGraphData(grab[0]);
        setLinePoints(grab[1]);
        
        //console.log(graphData)
    }, [stateData])

    /*
    useEffect(() => {
        setLinePoints(startEndPoints(graphData))
        console.log(linepoints)
    }, [graphData])
    */
    /*
    function startEndPoints(data){
        let n = data?.length
        let sumxy = 0;
        let sumx = 0;
        let sumy = 0;
        let sumxsqure = 0
        let minx = Infinity;
        let maxx = -Infinity;
        for(let i = 0; i < n; ++i){
            minx = Math.min(minx, data[i].x)
            maxx = Math.max(maxx, data[i].x)
            sumxy += data[i].x * data[i].y;
            sumx += data[i].x;
            sumy += data[i].y;
            sumxsqure += (data[i].x * data[i].x);
        }
        let slope = ((n * sumxy) - (sumx * sumy)) / ((n * sumxsqure) - (sumx * sumx))
        let yinter = (sumy / n) - (slope * (sumx / n))
        function getPoint(xval){
            return {x: xval, y: (xval*slope+yinter) }
        }
        setSlope(slope);
        return [ getPoint(minx), getPoint(maxx) ]
    }  
    */

    /* render() { */
        const options = {
            chart: {
                height: height+'%',
            },
            title: {
                text: 'Scatter Plot with Regression Line'
            },
            xAxis: {
                title: {
                    text: 'Base Case LMP'
                },
            },
            yAxis: {
                title: {
                    text: 'Simulation Case LMP'
                },
                lineWidth: 1,
                lineColor: '#E2E7FF'
            },
        series: [
            {
                type: 'scatter',
                name: 'Node Data',
                data: graphData
                    /*[{x: 30 , y : 30 , z: "help"},]  or  [1, 1.5, 2.8, 3.5, 3.9, 4.2] */,
                marker: {
                    radius: 4
                },
                tooltip: {
                    pointFormat: 'Base Case: {point.x} <br/> Scenario: {point.y} <br/> Name: {point.z} <br/> Time: {point.time:%Y-%m-%d %H:%M:%S}'
                },
            },
            {
                type: 'line',
                name: 'Regression Line',
                data: linepoints, //[dat[0], dat[dat.length-1]],
                color: "#60A4FC",
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        lineWidth: 0
                    }
                },
                enableMouseTracking: true,
                tooltip: {
                    headerFormat: "X: ",
                    pointFormat: '{point.x} <br/> Y : {point.y} <br/> Slope: ' + slope + '<br/> Y-int: ' + yint,
                },
            },
            /*
            {
                type: 'scatter',
                name: 'Simulation Case',
                data: dat.set2
                // [
                    [1,1.8],
                    [4,3.5],
                    [3,3],
                    [2,2],
                    [2.5,2.6],
                ] //,
                marker: {
                    radius: 2,
                },
                color:"#19B5D5",
                visible:false
            },
            */
        ]
    }
    return (
        <div
            style={{
                width: "100%",
                height: "100%"
                // border: "1px solid #ccc",
                // padding: "10px",
                // cursor: "pointer"
            }}
        >
            <HighchartsReact
                containerProps={{ style: { height: "100%" } }}
                highcharts={Highcharts}
                options={options}
                allowChartUpdate={true}
            /* ref={chartComponent} */
            />
        </div>
    );
    /* } */
}

export class Histogram extends React.Component {
    
    render() {
        const { mainText, subText } = this.props;
        const options = {
            chart: {
                /* height: '55%', */
                type: 'column'
            },
            title: {
                text: mainText
            },
            subtitle: {
                text: subText
            },
            xAxis: {
                /*categories: [
                2.5,
                17.5,
                32.5,
                47.5,
                62.5,
                77.5,
                107.5,
                122.5,
                137.5,
                152.5,
                167.5,
                182.5,
                197.5
                ],
                */
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Percent'
                },
                lineWidth: 1,
                lineColor: '#E2E7FF'
            },
            tooltip: {
                headerFormat: '<span style="font-size:12px">Price: {point.key}</span><br/>',
                pointFormat: 'Percent: : {point.y:.1f} ',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 1,
                    groupPadding: 0,
                    shadow: false
                }
            },
            series: [{
                name: 'HUB Node Prices',
                data: [2, 7, 17, 19, 13, 9, 7, 6, 5, 4, 3, 2, 1]

            }]
        }
        return (

            <HighchartsReact
                // containerProps={{ style: { height: "100%"}}}
                highcharts={Highcharts}
                options={options}
            />


        );
    }
}

function getPointCategoryName(point, dimension) {
    var series = point.series,
        isY = dimension === 'y',
        axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
}

function makeCells() {
    let cells = [];
    for (let i = 0; i < 24; ++i) {
        for (let j = 0; j < 12; ++j) {
            cells.push([j, i, Math.floor(Math.random() * 10)])
        }
    }
    return cells;
}

export class HeatMap extends React.Component {
    
    render() {
        const options = {
            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1,
                height: '94%',
            },


            title: {
                text: 'Maximum Absolute Percent Errors'
            },

            xAxis: {
                categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                title: {
                    text: 'Months'
                }
            },

            yAxis: {
                categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                title: {
                    text: 'Hour'
                },
            },

            colorAxis: {
                min: 0,
                minColor: '#E0FFFF',
                maxColor: Highcharts.getOptions().colors[5]
            },

            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 226.5
           },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.point.value + '</b>% at <b>' + getPointCategoryName(this.point, 'y') + '</b> on <b>' + getPointCategoryName(this.point, 'x') + '</b>';
                }
            },

            series: [{
                name: 'Month',
                borderWidth: 1,
                data: makeCells(),
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    // chartOptions: {
                    //     yAxis: {
                    //         labels: {
                    //             formatter: function () {
                    //                 return this.value.charAt(0);
                    //             }
                    //         }
                    //     }
                    // }
                }]
            }
        }
        return (
            <div
            style={{
                width: "100%",
                height: "100%"
                // border: "1px solid #ccc",
                // padding: "10px",
                // cursor: "pointer"
            }}
            >
            <HighchartsReact
                containerProps={{ style: { height: "100%"}}}
                highcharts={Highcharts}
                options={options}
            />
            </div>

        );
    }
}

export default function LineChart(props) {

    /*
    Have some function receive Data as a Constructor/Parameter
    Format for Specific Graph
    Display
    */
    const {data, height} = props

    function grabData(obj){
        let ret = {set1:[], set2:[]}
        let cap = 0;
        try{cap = obj.PERIOD_ID.length}catch{cap = 0}
        for(let i = 0; i < cap; i++){
            let toPush = {x: new Date(obj["PERIOD_ID"][i]).getTime(), y:  parseFloat(obj["MW"][i]), z: (obj['PNODE_NAME'][i])}
            if(obj["SCENARIO_ID"][i] === '1'){
                ret.set1.push(toPush)
            }
            else{   
                ret.set2.push(toPush)
            }
        }
        return ret;
    }
    let dat = grabData(data);
    /* console.log(dat) */

    const options = {
        chart: {
            height: height+'%',
            type: 'spline'
        },
        title: {
            text: 'System Demand'
        },
        subtitle: {
            text: 'Forecasted & Actual'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                hour: '%H:%M',
                year: '%b'
            },
            title: {
                text: 'Hour'
            }
        },
        yAxis: {
            title: {
                text: 'MW'
            },
            lineWidth: 1,
            lineColor: '#E2E7FF'
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: 'Time: {point.x:%Y-%m-%d %H:%M:%S} <br/> MW: {point.y:.2f} <br/> Name: {point.z}'
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 2.5
                }
            }
        },

        colors: ['Crimson', 'DeepSkyBlue'],
        // colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

        // Define the data points. All series have a dummy year of 1970/71 in order
        // to be compared on the same x axis. Note that in JavaScript, months start
        // at 0 for January, 1 for February etc.
        series: [
            {
                name: "Actual (MW)",
                data: dat.set1
                /*[
                    [Date.UTC(2022, 9, 19, 0, 0), 8250],
                    [Date.UTC(2022, 9, 19, 1, 0), 7777],
                    [Date.UTC(2022, 9, 19, 2, 0), 5677],
                ]*/
            }, {
                name: "Forecasted (MW)",
                data: dat.set2
            },
        ]
    }

    const chartComponent = useRef(null);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                // border: "1px solid #ccc",
                // padding: "10px",
                // cursor: "pointer"
            }}
        >
            <HighchartsReact
                containerProps={{ style: { height: "100%" } }}
                ref={chartComponent}
                highcharts={Highcharts}
                options={options}
                allowChartUpdate={true}
            />
        </div>
    );
}


export function PeroidButton(props){
    const [period, setPeriod] = useState("All")
    const {setParentPeriod} = props;
    const [allButton, setAllButton] = useState("blackButton")
    const [yearButton, setYearButton] = useState("blackButton")
    const [monthButton, setMonthButton] = useState("blackButton")
    const [weekButton, setWeekButton] = useState("blackButton")
    const [dayButton, setDayButton] = useState("blackButton")

    const handleChange = (str) => {
        setPeriod(str);
    };
    
    useEffect(() => {
        if(period === "All") {setAllButton("whiteButton")}
        else{setAllButton("blackButton")}

        if(period === "Year") {setYearButton("whiteButton")}
        else{setYearButton("blackButton")}

        if(period === "Month") {setMonthButton("whiteButton")}
        else{setMonthButton("blackButton")}

        if(period === "Week") {setWeekButton("whiteButton")}
        else{setWeekButton("blackButton")}

        if(period === "Day") {setDayButton("whiteButton")}
        else{setDayButton("blackButton")}

        setParentPeriod(period);
    }, [period])

    return (
    <div style={{margin: "auto"}}>
      <button className={allButton} onClick={() => handleChange('All')}>All</button>
      <button className={yearButton} onClick={() => handleChange('Year')}>Yearly</button>
      <button className={monthButton} onClick={() => handleChange('Month')}>Monthly</button>
      <button className={weekButton} onClick={() => handleChange('Week')}>Weekly</button>
      <button className={dayButton} onClick={() => handleChange('Day')}>Daily</button>
    </div>

    );
}

export function DataTable(props){
    const {period, data} = props
    const [stateData, setStateData] = useState();
    
    useEffect(() => {
        setStateData(data)
    }, [data])

    useEffect(() => {
        /* console.log(stateData) */
    }, [stateData])

    return (
    <div className='DataTable'>
        <table>
        <tr>
          <th>Period Start</th>
          <th>STD</th>
          <th>R^2</th>
        </tr>
        <tr>
          <td>Date 1</td>
          <td>Some Std</td>
          <td>Some R^2</td>
        </tr>
        <tr>
          <td>Date 2</td>
          <td>Some Std</td>
          <td>Some R^2</td>
        </tr>
        <tr>
          <td>Date 3</td>
          <td>Some Std</td>
          <td>Some R^2</td>
        </tr>
      </table>
    </div>
    );
}


// export class LineChart extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         const options = {
//             chart: {
//                 type: 'spline'
//             },
//             title: {
//                 text: 'System Demand'
//             },
//             subtitle: {
//                 text: 'Forecasted & Actual'
//             },
//             xAxis: {
//                 type: 'datetime',
//                 dateTimeLabelFormats: { // don't display the dummy year
//                     hour: '%H:%M',
//                     year: '%b'
//                 },
//                 title: {
//                     text: 'Hour'
//                 }
//             },
//             yAxis: {
//                 title: {
//                     text: 'MW'
//                 },
//                 min: 0
//             },
//             tooltip: {
//                 headerFormat: '<b>{series.name}</b><br>',
//                 pointFormat: '{point.x:%H:%M}: {point.y:.2f} MW'
//             },

//             plotOptions: {
//                 series: {
//                     marker: {
//                         enabled: true,
//                         radius: 2.5
//                     }
//                 }
//             },

//             colors: ['Crimson', 'DeepSkyBlue'],
//             // colors: ['#6CF', '#39F', '#06C', '#036', '#000'],

//             // Define the data points. All series have a dummy year of 1970/71 in order
//             // to be compared on the same x axis. Note that in JavaScript, months start
//             // at 0 for January, 1 for February etc.
//             series: [
//                 {
//                     name: "Forecasted (MW)",
//                     data: [
//                         [Date.UTC(2022, 9, 19, 0, 0), 8250],
//                         [Date.UTC(2022, 9, 19, 1, 0), 7777],
//                         [Date.UTC(2022, 9, 19, 2, 0), 5677],
//                         [Date.UTC(2022, 9, 19, 3, 0), 4077],
//                         [Date.UTC(2022, 9, 19, 4, 0), 3600],
//                         [Date.UTC(2022, 9, 19, 5, 0), 2200],
//                         [Date.UTC(2022, 9, 19, 6, 0), 7450],
//                         [Date.UTC(2022, 9, 19, 7, 0), 9870],
//                         [Date.UTC(2022, 9, 19, 8, 0), 11897],
//                         [Date.UTC(2022, 9, 19, 9, 0), 12789],
//                         [Date.UTC(2022, 9, 19, 10, 0), 11567],
//                         [Date.UTC(2022, 9, 19, 11, 0), 10456],
//                         [Date.UTC(2022, 9, 19, 12, 0), 10897],
//                         [Date.UTC(2022, 9, 19, 13, 0), 10453],
//                         [Date.UTC(2022, 9, 19, 14, 0), 9853],
//                         [Date.UTC(2022, 9, 19, 15, 0), 10234],
//                         [Date.UTC(2022, 9, 19, 16, 0), 11456],
//                         [Date.UTC(2022, 9, 19, 17, 0), 12678],
//                         [Date.UTC(2022, 9, 19, 18, 0), 14357],
//                         [Date.UTC(2022, 9, 19, 19, 0), 15340],
//                         [Date.UTC(2022, 9, 19, 20, 0), 16790],
//                         [Date.UTC(2022, 9, 19, 21, 0), 13335],
//                         [Date.UTC(2022, 9, 19, 22, 0), 9340],
//                         [Date.UTC(2022, 9, 19, 23, 0), 8950],
//                     ]
//                 }, {
//                     name: "Actual (MW)",
//                     data: [
//                         [Date.UTC(2022, 9, 19, 0, 0), 8350],
//                         [Date.UTC(2022, 9, 19, 1, 0), 7677],
//                         [Date.UTC(2022, 9, 19, 2, 0), 5877],
//                         [Date.UTC(2022, 9, 19, 3, 0), 4177],
//                         [Date.UTC(2022, 9, 19, 4, 0), 3500],
//                         [Date.UTC(2022, 9, 19, 5, 0), 2800],
//                         [Date.UTC(2022, 9, 19, 6, 0), 7750],
//                         [Date.UTC(2022, 9, 19, 7, 0), 9370],
//                         [Date.UTC(2022, 9, 19, 8, 0), 12897],
//                         [Date.UTC(2022, 9, 19, 9, 0), 11789],
//                         [Date.UTC(2022, 9, 19, 10, 0), 11667],
//                         [Date.UTC(2022, 9, 19, 11, 0), 10756],
//                         [Date.UTC(2022, 9, 19, 12, 0), 10697],
//                         [Date.UTC(2022, 9, 19, 13, 0), 10753],
//                         [Date.UTC(2022, 9, 19, 14, 0), 9833],
//                         [Date.UTC(2022, 9, 19, 15, 0), 10334],
//                         [Date.UTC(2022, 9, 19, 16, 0), 11756],
//                         [Date.UTC(2022, 9, 19, 17, 0), 12478],
//                         [Date.UTC(2022, 9, 19, 18, 0), 14657],
//                         [Date.UTC(2022, 9, 19, 19, 0), 15740],
//                         [Date.UTC(2022, 9, 19, 20, 0), 16890],
//                         [Date.UTC(2022, 9, 19, 21, 0), 14535],
//                         [Date.UTC(2022, 9, 19, 22, 0), 7360],
//                         [Date.UTC(2022, 9, 19, 23, 0), 6940],      
//                     ]
//                 }, 
//             ]
//         }


//         return (
//             <HighchartsReact
//                 containerProps={{ style: { height: "100%"}}}
//                 highcharts={Highcharts}
//                 options={options}
//             />

//         );
//     }
// }

