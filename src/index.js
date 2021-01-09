const {
  daysOfYear
} = require('./util');

// USE THESE DOCS: https://api.anychart.com/anychart.charts.Map

anychart.onDocumentReady(() => {

  // create map
  let map = anychart.map();
  // map.title('2020 in Search')

  let allData = require('../dataset/all_us_trends_2020.json');
  let states = allData["2020-1-1"];
  // let states = require('../temp.json');

  // create data set
  let dataSet = anychart.data.set(states);

  // create choropleth series
  series = map.choropleth(dataSet);

  // enable labels
  series.labels(true);
  labels = series.labels();
    
  // labels setting
  labels.fontColor('white');
  labels.fontSize("14px");
  labels.fontFamily('Roboto');
  labels.fontWeight('bold');
  labels.offsetY(-10);
  labels.connectorStroke({ color: '#DCDCDC' , thickness: 2 });
  labels.padding(6);
  labels.hAlign('center')

  // set the overlapping mode
  map.overlapMode(true);
  // map.overlapMode("no-overlap");

  // set geoIdField to 'id', this field contains in geo data meta properties
  series.geoIdField('id');

  map.background().fill('#1b262c')
//   map.stroke.fill('white')
  series.stroke("#1b262c");

  // set map color settings
  // series.colorScale(anychart.scales.linearColor('#0f4c75', '#bbe1fa'));
  series.colorScale(anychart.scales.ordinalColor([
    {from:0, to:9, color: '#F94144'},
    {from:10, to:19, color: '#F3722C'},
    {from:20, to:29, color: '#F7B926'},
    {from:30, to:39, color: '#90BE6D'},
    {from:40, to:49, color: '#43AA8B'},
    {from:50, to:59, color: '#4D908E'},
    {from:60, to:69, color: '#577590'},
    {from:70, to:70, color: '#277DA1'},
    {from:80, to:90, color: '#8F43AB'}
  ]));
  // series.colorScale(anychart.scales.ordinalColor([
  //   {from:0, to:9, color: '#00188f'},
  //   {from:10, to:19, color: '#ff8c00'},
  //   {from:20, to:29, color: '#00b294'},
  //   {from:30, to:39, color: '#ec008c'},
  //   {from:40, to:49, color: '#bad80a'},
  //   {from:50, to:59, color: '#68217a'},
  //   {from:60, to:69, color: '#009e49'},
  //   {from:70, to:79, color: '#e81123'},
  //   {from:80, to:89, color: '#00bcf2'},
  //   {from:90, to:100, color: '#fff100'},
  // ]));
  series.hovered().fill('#577590');

  // set geo data, you can find this map in our geo maps collection
  map.geoData(anychart.maps['united_states_of_america']);

  //set map container id (div)
  map.container('container');

  //initiate map drawing
  map.draw();

  addEventListeners(allData, dataSet);
});

const getMonthDayStr = (date) => {
  let month = date.toLocaleString('default', { month: 'short' });
  let day = date.getUTCDate();
  return month.concat(' ', day, ', ');
}

const addEventListeners = (allData, dataSet) => {
  let slider = document.querySelector(".rs-range");
  let playButton = document.querySelector('.play-button');
  let monthDayLabel = document.querySelector('.month-day');
  let yearLabel = document.querySelector('.year');
  let date = new Date(daysOfYear[0]);
  let playing = false;
  
  monthDayLabel.innerHTML = getMonthDayStr(date);
  yearLabel.innerHTML = date.getFullYear();

  const updateState = () => {
    dataSet.data(allData[daysOfYear[slider.value]])
    // anychart.data.set(allData[daysOfYear[slider.value]])
    let date = new Date(daysOfYear[slider.value]);
    monthDayLabel.innerHTML = getMonthDayStr(date); 
    yearLabel.innerHTML = date.getFullYear();
  }

  slider.oninput = () => {
    updateState();
  }

  slider.onchange = () => {
    const timestamp = Math.floor((slider.value/365)*182)
    document.querySelector('#audio').currentTime = timestamp;
  }

  let playInterval;
  playButton.addEventListener('click', () => {
    const play = () => {
      if (slider.value < 365) {
        let val = Number(slider.value);
        slider.value = val + 1;
        updateState();
      } else {
        let credits = document.querySelector('.credits');
        let main = document.querySelector('.main');
        credits.classList.add('visible');
        main.classList.add('invisible');
      }
    }
    if (!playing) {
      play();
      document.querySelector('#audio').play();
      playInterval = setInterval(() => play(), 500);
      playing = true;
    } else {
      document.querySelector('#audio').pause();
      clearInterval(playInterval);
      playing = false;
    }
  })

}


 // -- SAVE THESE BAD BOYS --
// setTimeout(() => {
//   dataSet.data(states2)
// }, 5000);
// dataSet.data([{"id":"US.CA", "name":"KB", "value":8}])
// dataSet.row(8, {"id":"US.CA", "name":"KB", "value":8})
// AND THESE (FOR EASIER MANIPULATION)
// let view = dataSet.mapAs();
// view.set(8, 'name', 'neighh');
// AND THIS (!!!)
// let idx = view.find('id', 'US.CA')
// view.set(idx, 'name', 'niiice');
// view.set(idx, 'fill', '#009688');