require([
    "esri/SpatialReference",
    "esri/geometry/Extent",
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/tasks/FeatureSet",
    "esri/tasks/ServiceAreaTask",
    "esri/tasks/ServiceAreaParameters",
    "esri/tasks/ServiceAreaSolveResult",
    "esri/graphic",
    "esri/Color",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/tasks/query",


    "dojo/ready",
    "dojo/parser",
    "dojo/on",
    "dojo/_base/array",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"
],
function (SpatialReference,Extent,Map,FeatureLayer,
    FeatureSet,ServiceAreaTask,ServiceAreaParameters,ServiceAreaSolveResult,Graphic,Color,SimpleFillSymbol,SimpleLineSymbol,Query,
    
    ready, parser, on, arrayUtils, array,
    BorderContainer, ContentPane) {
        ready(function () {

            parser.parse();

            var extent = new Extent(-425561.4572649839,4919885.670636162,-396209.6384035158,4933682.554241618, new SpatialReference({ wkid:102100 }));

            var mapMain = new Map("divMap", {
                basemap: "streets-vector",
                extent: extent,
                zoom: 12
            });

            var centrosSalud = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_PCP/FeatureServer/0",{
                outFields:["*"],
            })

            mapMain.addLayers([centrosSalud]);

            var saParameters = new ServiceAreaParameters();

            var graphic = new Graphic (centrosSalud)

            var features = [];
            features.push(graphic);

            var centros = new FeatureSet();

            tikkaMasala = new Query(centrosSalud);

            tikkaMasala.where = "1 = 1";

            centrosSalud.selectFeatures(tikkaMasala);

            centrosSalud.on("selection-complete", añadeFS);

            function añadeFS (seleccion){
                console.log(seleccion);

            };


            // centros.features = features;
            // saParameters.facilities = centros;

            saParameters.facilities= tikkaMasala;
            
            saParameters.defaultBreaks = [3];
            saParameters.outSpatialReference = mapMain.spatialReference;
            saParameters.impedanceAttribute = "TiempoPie";

            var saTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");

            saTask.solve(saParameters,function(solveResult){

                var line = new SimpleLineSymbol();
                line.setStyle(SimpleLineSymbol.STYLE_NULL);
                var fill = new SimpleFillSymbol();
                fill.setOutline(line);
                fill.setColor(new Color([230, 0, 0, 0.52]));

                var areasSymbol = new SimpleFillSymbol(line,fill);

                var result = solveResult

                arrayUtils.forEach(solveResult.serviceAreaPolygons, function(serviceArea){
                    serviceArea.setSymbol(areasSymbol);
                    mapMain.graphics.add(serviceArea)
                    console.log(serviceArea)
                })

            },function(err){
                console.log("Me tiro a las vias");
              })

            //   saTask.solve(saParameters,function(serviceAreaSolveResult){
            //     var result = serviceAreaSolveResult;
            //     dojo.forEach(serviceAreaSolveResult.serviceAreaPolygons,function(graphic){
            //       mapMain.graphics.add(graphic);
            //     });
            //     console.log("salta")
            //   });

    })
});
