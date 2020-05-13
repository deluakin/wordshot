positions = [];

self.addEventListener("message", function(e) {
    var jsonData = e.data
    let h = jsonData.window;
    var timerid = setInterval(function(){ 
        var top = jsonData.top + 1;
        var exist = false
        positions.forEach((data) => {
            if(data.key === jsonData.id){
                top = data.top + 1;
                data.top = top
                exist = true
            }
        })

        if(!exist){
            var position = {
                key: jsonData.id,
                top: top
            }
            positions.push(position)   
        }

        postMessage({id: jsonData.id, speed: jsonData.speed, top: top});
        
        if(top > h){
            clearInterval(timerid)
        }
     }, jsonData.speed);
}, false);