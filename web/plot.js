function newrow(){
    var newx = '<div class="row align-items-center no-gutters"><div class="col-1"><input type="text" class="form-control" id="x_0" placeholder="xi_0"></div><div class="col-10"><input type="text" class="form-control" id="x" placeholder="xi"></div><button class="remove btn btn-outline-light">&#10060;</button></div>';
    count = 1;
    $('input[id="x"]').each(function(i, elem){
        count++;
    });
    return newx.split("xi").join('x'+count);
}

jQuery(function(){
    jQuery("#draw").click(onDraw);
    jQuery('#addx').click(function(){
        $('fieldset').append(newrow());
    });
    $(document).on('click', '.remove', function() {
        $(this).parent().remove();
    });
});

function onDraw()
{

    var data = {};
    jQuery('input[id="x"]').each(function(i, elem){
        data['x' + (i + 1)] = $(elem).val();
    });
    jQuery('input[id="x_0"]').each(function(i, elem){
        data['x' + (i + 1) + '_0'] = $(elem).val();
    });
    data['N'] = jQuery("#N").val();

    //var er = jQuery('<div>' + data + '</div></br>');
    var code = jQuery(".code");
    var d = jQuery('<div id="success_alert" class="alert alert-warning text_center" role="alert">ОБРАБОТКА</div>');
    code.prepend(d);

    jQuery.post('http://127.0.0.1:5000', data, success)
    
}

function success(data)
{
    console.log(data);
    //console.log("success");
    jQuery("#success_alert").delay(500).fadeOut(100);
    plot();
}

//--------------------------------------------------------------------------
function plot(path) {
    Plotly.d3.csv("../res/result.csv", function(data){ processData(data) } );
    };

function processData(allRows) {

    console.log(allRows);
    ndims = Object.keys(allRows[0]).length - 1

    var xs = {};
    for (var i = 1; i <= ndims; i++){
        xs['x' + i] = [];
    }
    if (ndims < 3){
        xs['x3'] = [];
    }

    var t = [];

    for (var i = 0; i < allRows.length; i++) {
        row = allRows[i];
        for (var j = 1; j <= ndims; j++){
            xs['x' + j].push(row['x' + j]);
        }
        if (ndims < 3){
            xs['x3'].push(0);
        }
        t.push(row['t']);
    }

    console.log(ndims);
    console.log(xs);

    makePlotXY(xs['x1'], xs['x2']);
    //makePlotPoincare(x, xx);
    makePlotT(ndims, xs, t);
    makePlot3D(xs['x1'], xs['x2'], xs['x3']);
}

function makePlotXY(x, y, ndims){
var plotDiv = document.getElementById("plot");
var traces = [{
    x: x,
    y: y
}];

Plotly.newPlot('chartXY', traces,
    {title: 'Фазовая кривая'});
};

function makePlotPoincare(x, y){
var plotDiv = document.getElementById("plot");
var traces = [{
    x: x,
    y: y
}];

Plotly.newPlot('chartPoincare', traces,
    {title: 'Пуанкаре'});
};

function makePlotT(ndims, dims, t){
var plotDiv = document.getElementById("plot");

traces = []

for (var i = 1; i <= ndims; i++) {
    id = "x" + i
    traces.push({
        x: t,
        y: dims[id],
        name: id
    });
}

Plotly.newPlot('chartXYt', traces,
    {title: 'XYt'});
};

function makePlot3D(x, y, z){
var plotDiv = document.getElementById("plot");

// base plane
var basePlane = [];
for(let x = 0; x <= 10; x++){
    var line = []
    for(let y = 0; y <= 10; y++)
        line.push(0)
    basePlane.push(line)
}

// input plane
var inputPlane = [];
for(let x = 0; x <= 10; x++){
    var line = []
    for(let y = 0; y <= 10; y++)
        line.push(-x-y-2)
    inputPlane.push(line)
}

function getData() {
    var basePlane = [];
    for(let i = 0; i<10; i++)
    basePlane.push(Array(10).fill().map(() => 0))
    return basePlane;
}  

var data = getData();
//console.log(data);

var trace = {
    type: 'scatter3d',
    mode: 'markers',
    x: x,
    y: y,
    z: z,
    opacity: 1,
    marker: {
        color: '#000000',
		size: 2,
    },
    name: 'flow'
};
/*
var base = {
    z: basePlane,
    showscale: false,
    opacity: 0.1,
    type: 'surface',
    name: 'базовая плоскость'
};

var input = {
    z: inputPlane,
    showscale: false,
    opacity: 0.9,
    type: 'surface',
    name: 'данная плоскость'
};

data = [base, input, trace];
*/
data = [trace];
Plotly.newPlot('chartXY3D', data,
    {
        title: 'XY',
        height: 1000
    });
};
