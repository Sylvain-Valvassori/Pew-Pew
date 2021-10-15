/*=====================================================================================
                            =====| Setup Game  et Variables |=====
=====================================================================================*/

    const canvas = document.getElementById('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width   = 400;
    canvas.height  = 600;
    const shipSize = 20;
    let posY  = canvas.height-shipSize;
    let posX  = canvas.width/2;

    let lifeCompt = 3;


    const projectiles = [];
    const enemies = [];

    // =====| Setup color |=====
    const nullColor   = 'rgba(218, 218, 218, 1)';
    const mainColor   = 'rgba(254, 200, 89, 1)';
    const secondColor = 'rgba(67, 181, 160, 1)';
    const accentColor = 'rgba(250, 68, 140, 1)';
    const lightColor  = 'rgba(73, 29, 136, 1)';
    const darkColor   = 'rgba(51, 26, 56, 1)';
    // =========================

/*=====================================================================================
                            =====| Setup Classes |=====
=====================================================================================*/

    class Ship {

        constructor( posX ){
            this.x     = posX
            this.y     = posY;
            this.color = accentColor;
        }
        
        draw(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let h = shipSize * (Math.sqrt(3)/2);

            ctx.beginPath();
                ctx.fillStyle =  this.color;
                ctx.moveTo( 0 + this.x               , (-h / 2  + this.y));
                ctx.lineTo( (-shipSize / 2) + this.x , ( h / 2) + this.y);
                ctx.lineTo( ( shipSize / 2) + this.x , ( h / 2) + this.y);
                ctx.lineTo( 0 + this.x               , (-h / 2) + this.y);
                ctx.fill(); 
            ctx.closePath();
        }
    }

    class Projectile {
        
        constructor( posX, velocity ){
            this.x = posX;
            this.y = posY - shipSize;
            this.radius = 2;
            this.v = velocity;
            this.color = secondColor;
        }
        
        draw(){
            
            ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
                ctx.fill();
            ctx.closePath();
        }
        
        update(){
            this.draw();
            this.y = this.y - this.v ;
        }
    }

    class Enemy {
        
        constructor( posX, posY, velocity, radius ){
            this.x = posX;
            this.y = posY;
            this.radius = radius;
            this.v = velocity;
            this.color = mainColor;
        }
        
        draw(){
            
            ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
                ctx.fill();
            ctx.closePath();
        }
        
        update(){
            this.draw();
            this.y = this.y + this.v ;
        }
    }

/*=====================================================================================
                            =====| Setup Fonctions |=====
=====================================================================================*/

    let animationId

    function animate() {
        animationId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const ship= new Ship(posX);
        ship.draw();
        
        projectiles.forEach( (projectile, index) => {
            projectile.update()
            
            // remove projectile who are off screen
            if ( projectile.y + projectile.radius < 0 ) {
                setTimeout(() => {
                    projectiles.splice(index, 1);
                }, 0);
            }
        });
        
        
        enemies.forEach( (enemy, index )=> {
            enemy.update()
        
            // =====| End Game |=====

            const dist = canvas.height - enemy.y;

            if (dist - enemy.radius < 1){
                
                lifeCompt = lifeCompt-1;
                document.getElementById('lifeCompt').innerHTML=lifeCompt;

                setTimeout(() => {
                    enemies.splice(index, 1);
                }, 0);
                    
                if (lifeCompt === 0){   
                    document.getElementById('lifeCompt').innerHTML=lifeCompt;       
                    cancelAnimationFrame(animationId);
                    // alert('Eng game');
                }  
            }
            
           
            // =====| detected collision entre projectile et enemy |=====

            projectiles.forEach((projectile, projectileIndex) => { 
                const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                
                if (dist - enemy.radius - projectile.radius < 1){
                    
                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
             })
        })
    }

    function spawnEnemies() {
        setInterval( () => {
            const radius = (Math.random() * (20 - 5) + 5);
            const posX = enemiesPositionSpwan(radius);
            const posY = 0 - radius;
            const velocity = 0.5;
            enemies.push( new Enemy(posX, posY, velocity, radius) );
        }, 3500)
    }

    function enemiesPositionSpwan (radius) {
        
        let r = radius;
        let spawnPos = Math.random() * canvas.width;

        return spawnPos < 0 || spawnPos < r ? spawnPos = r
             : spawnPos > canvas.width - r  ? spawnPos = canvas.width - r
             : spawnPos;  
    }

/*=====================================================================================
                            =====| Event Listener |=====
=====================================================================================*/

    addEventListener('keydown', (e) => {
        if (e.key == 'ArrowLeft' && posX >=(shipSize/2)) {
            posX -= 5;
        }
        else if (e.key == 'ArrowRight' && posX <= (canvas.width-(shipSize/2))) {
            posX += 5;
        }

        

        if(e.code == 'Space'){
            projectiles.push( new Projectile(posX, 1) );
        }
        
    });
    
/*=====================================================================================
                            =====| Game animation |=====
=====================================================================================*/
   
    animate();
    spawnEnemies();










/* 


if (lifeCompt != 0){          
    lifeCompt = lifeCompt-1;
    console.log('life '+ lifeCompt);

}else{
    console.log('end game');
    cancelAnimationFrame(animationId);
}















*/