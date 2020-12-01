var control;

//function myFunction(){   
//    status = $("input[type='checkbox']").is(":checked");
//    console.log("Comando por web: " + status);
//
//    $.post('/modo',
//    {
//        activo:"0"
//    }, 
//    function(data,status){
//        console.log("Data: " + data + "\nStatus: " + status);
 //   });
//}

document.addEventListener('DOMContentLoaded', function(){

        var lastUpdateX = 50;
        var lastUpdateY = 50;
  
        var joystick = document.getElementById("joystick");
      
        var target = document.getElementById("knob");
        var target_x = joystick.clientWidth/2-target.clientWidth/2;
        var target_y = joystick.clientHeight/2-target.clientHeight/2;
    
        var panSpan  = document.getElementById("panValue");
        var tiltSpan = document.getElementById("tiltValue");

        // Establece la posicion inicial en el centro
        target.style.webkitTransform = "translate("+target_x+"px, "+target_y+"px)";
    
        // Actualiza la posicion de los atributos
        updatePositionAttributes(target,target_x,target_y);
    
        // Comportamiento con la clase "draggable"
        interact('.draggable')
            .draggable({
                inertia: false,
                // Evita que el elemento salga del area
                restrict: {
                    restriction: "parent",
                    endOnly: false,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                },
                onmove: dragMoveListener,
                onend: dragReleaseListener
            });

        function dragReleaseListener(event){
            var target = event.target;

            if( control == 0 ){
                TweenLite.to(target, 0.2, {ease: Back.easeOut.config(1.7), "webkitTransform":"translate("+target_x+"px, "+target_y+"px)"});
                updatePositionAttributes(target,target_x,target_y);
                panSpan.innerHTML = 512;
                tiltSpan.innerHTML = 512;
            }
        }
    
        function dragMoveListener (event) {
            var target = event.target;
                    
            // Si el control es 0 -> comando a cargo de la web
            if( control == 0){
                // Calcula la nueva ubicación en base a la almaceada (data-x y data-y) y al evento 
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        
                // Desplaza el elemento
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
                
                // Actualiza la ubicación en data-x y data-y
                updatePositionAttributes(target,x,y);
        
                // Update text display
                panSpan.innerHTML = parseInt((x*1024)/100);
                tiltSpan.innerHTML = parseInt(1024 - (y*1024)/100);
            }
        }
    
        // (0,0) arriba a la derecha; (100,100) abajo a la izquierda
        function updatePositionAttributes(element,x,y){

            // Si notas mucha congestion descomenta esta linea
            if( (lastUpdateX - x) > 5 || (lastUpdateX - x) < -5 || (lastUpdateY - y) > 5 || (lastUpdateY - y) < -5  ){
                $.post('/comandos',
                {
                    ejeX:(x*1024)/100,
                    ejeY:(y*1024)/100
                }, 
                function(data,status){
                    console.log("Data: " + data + "\nStatus: " + status);
                });

                lastUpdateX = x;
                lastUpdateY = y;
            }
        
            if( control == 0 ){
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }    
   });