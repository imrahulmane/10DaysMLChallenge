$("#image-selector").change (function() {
    let reader = new FileReader();

    reader.onload = function() {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
    }

    let file  = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});

//loading model
let model;
(async function() {
    console.log("loading model");
    $(".progress-bar").show();
    model = await tf.loadLayersModel("http://127.0.0.1:8000/tfjs-models/MobileNet/model.json");
    // model = await tf.loadModel(mobileNet);
    console.log("model loaded");
    $(".progress-bar").hide();
})();

function preProcessImage() {
    let image = $("#selected-image").get(0);
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224])
        .toFloat();
    let offset = tf.scalar(127.5);
    return tensor.sub(offset).div(offset).expandDims();
}


$("#predict-button").click(async function(){

    let tensor = preProcessImage();

    let predictions = await model.predict(tensor).data();

    let top5 = Array.from(predictions)
        .map(function(p, i) {
            return { probability : p,
            className : IMAGENET_CLASSES[i]
        };
        }).sort(function(a, b) {
            return b.probability - a.probability;
        }).slice(0, 5);


    $("#prediction-list").empty();
    top5.forEach(function (p) {
        $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
    });

});
