<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    
    <link rel="stylesheet" href="<?php echo esc_url(get_stylesheet_uri()); ?>">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>   
    <header>
        <a href="#" class="logo2"><img  src="<?php echo get_template_directory_uri(); ?>/images/image1.png" alt="Logo" class="logo4"></a>
        <div class="MenuToggle"></div>
        <nav>
            <ul>
                <li><a href="#">Inicio</a></li>                
                <li><a href="#">Inmuebles</a></li>
            </ul>
        </nav>
    </header> 
    
    <div col-md-12>    
            
        <div class="section " style=" background-image: url('<?php echo get_template_directory_uri(); ?>/images/image2.jpg'); height: 100vh;">      
            <div class="space3"></div>      
            <div class="col text-center ">
                <h1 class="display-3 ">Personal Shopper</h1>
                <h2 class="" >Asesor Inmobiliario</h2>
                <div class="container ">        
                    <div class="center" style="width: 450px; margin: 0 auto;">
                        <div class="animate-box fadeInUp animated ">
                            <div class="property holder">
                                <a href="#" class="fh5co-property no-underline" style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/image2.jpg');">
                                    <span class="status">Sale</span>
                                    <ul class="list-details">
                                        <li>2000 ft sq</li>
                                        <li>5 Bedroom:</li>
                                        <li>4 Bathroom:</li>
                                        <li>3 Garage:</li>
                                    </ul>
                                    
                                </a>
                                <div class="property-details">                                   
                                        <div>
                                            <h3>Tata</h3>
                                            <span class="price">1.250.000€</span>                                    
                                            <span class="address">Thomas Street, St. Louis, MO 8990, USA</span>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>         
            </div>
        </div>

        <div class="section" style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/image5.png'); height: 105vh;">
            <div class="space5" ></div>
            <div class="col text-center">
                <h1>¡Bienvenido!</h1>
                <div class="space2"></div>
                <div >
                    <p class="texto">¿Quieres comprar o vender una casa, un apartamento o una propiedad en España?</p>
                    <p class="texto">La Costa Brava es una de las zonas más ricas y preciadas por extranjeros en España.</p>   
                    <p class="texto">El clima es excelente 12 meses al año, ideal para vacaciones o residencia permanente.</p> 
                    <p class="texto">Tanto en verano como en invierno, la vegetación no desaparece.</p> 
                </div>           
            </div>
            
        </div>

        <div class="section" style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/image3.0.png'); height: 105vh;">
            
            <div class="centered-content">
                <div class="col text-center">
                    <p class="texto">La Costa Brava es el nombre dado a la zona costera de España, que comienza en Blanes y termina en la frontera con Francia en Portbou. Limita al norte con la costa Vermella y al sur con la costa del Maresme. Esta franja costera cubre una superficie de 214 km y está formada por las regiones catalanas alto-Empordà, BAS-Empordà y La Selva.</p>
                    <p class="texto"    >Se encuentra ubicado en la provincia de Heron, perteneciente a la Comunidad Autónoma de Cataluña en España. Aquí, en alguna parte, será su nuevo hogar.</p>                
                </div>
            </div>
            
        </div>

        <div class="section" style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/image4.png'); height: 130vh;">
            <div class="space2"></div>
            <div class="col text-center">
                <h1>¿Cómo le podemos ayudar?</h1>
                <div class="space5"></div>  
                <p class="texto2">1.-Lo más importante es encontrar lo que usted necesita(su casa). Por eso es muy importante describir bien como tiene que ser.</p>
                <p class="texto2">2.-Negociar el precio.</p>   
                <p class="texto2">3.- Asistir durante todo el proceso de compra y ayuda con todo el papeleo.</p> 
                <p class="texto2">4.- Ayuda en conseguir el NIE (documento de residente extranjero) para poder adquirir el inmueble.</p>
                <p class="texto2">5.- Abrir cuenta bancaria para poder adquirir el inmueble.</p>
                <p class="texto2">6.- Si se requiere organizamos la financiación bancaria.</p>
                <p class="texto2">7.- Si el cliente quiere, le prestamos el servicio de recibirle en el aeropuerto y alojamiento en el hotel deseado.</p>
                <p class="texto2">8.- Si se requiere prestamos el servicio de mantenimiento y gestión del inmueble posterior a la venta.</p>
                <p class="texto2">9.- Ayuda en adquirir un medio de transporte, electrodomésticos etc... si es necesario.</p>
                <p class="texto2">10.- Si se requieren trabajos de reparación, reformas y limpieza - tenemos los contactos necesarios.</p>
                <p class="texto2">11.- Decoración artística con pinturas al óleo, por encargo.</p>
                <img src="<?php echo get_template_directory_uri(); ?>/images/tataempresarioEsperico.png"  width="300" height="300">
                <img src="" alt="">
                <p>Contacto: +34 722 279 795</p>
                <p>Gmail: lacostahaus@gmail.com</p>
            </div>
            
        </div>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>