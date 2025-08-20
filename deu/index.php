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
        <a href="https://lacostahaus.com"><img class="logo"  src="<?php echo get_template_directory_uri(); ?>/images/image1.png" ></a>   
        <div class="MenuToggle"></div>
        <nav>
            <ul>
                <li><a href="https://lacostahaus.com">Start</a></li>
                <li><a href="https://lacostahaus.com/es-inmuebles">Anwesen</a></li>
                <li class="dropdown">
                    <a href="#" class="text-white px-3 dropdown-toggle" id="languageDropdown">Sprachen</a>
                    <ul class="dropdown-menu">
                        <li><a href="https://lacostahaus.com/es" class="dropdown-item">Español</a></li>
                        <li><a href="https://lacostahaus.com/eng" class="dropdown-item">English</a></li>
                        <li><a href="https://lacostahaus.com/fra" class="dropdown-item">Français</a></li>
                        <li><a href="https://lacostahaus.com/deu" class="dropdown-item">Deutsch</a></li>
                        <li><a href="https://lacostahaus.com/pyc" class="dropdown-item">Русский</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>

    <div style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/image2.jpg');" class="section">
        <div class="space2"></div>
        <div class="section">
            <div class="container">
                <h1 class="justify-content-center text-center">Persönlicher Einkäufer</h1>
                <h2 class="justify-content-center text-center">Immobilienberater</h2>
            </div>
        </div>
        <div class="space2"></div>
    </div>
    
    <div style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/image3.png');" class="section">
        <div class="space2"></div>
        <div class="section">
            <div class="container">
               <h1>Bewertungsbericht</h1>
               <p>Sie möchten Ihre Immobilie zum besten Preis und in maximal 2 Monaten verkaufen?</p>
               <p>Dann benötigen Sie einen Bewertungsbericht mit einem exklusiven Marketingplan.</p>
               <div class="space5"></div>
               <div class="row">
                    <a href="https://lacostahaus.com/es-contactos">
                        <button>
                            <span>Fordern Sie eine kostenlose Bewertung an</span>
                        </button>
                    </a>    
               </div>
            </div>
        </div>
        <div class="space2"></div>  
    </div>

    <div class="section" style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/image5.png');">
        <h2 class="justify-content-center text-center">Willkommen!</h2>
        <p>Möchten Sie ein Haus, eine Wohnung oder eine Immobilie in Spanien kaufen oder verkaufen?</p>
        <p>Die Costa Brava ist eine der reichsten und für Ausländer am meisten geschätzten Gebiete Spaniens.</p>
        <p>Das Klima ist 12 Monate im Jahr ausgezeichnet, ideal für Urlaub oder dauerhaften Aufenthalt.</p>
        <p>Sowohl im Sommer als auch im Winter verschwindet die Vegetation nicht.</p>
        <div class="space2"></div>
        <p>Als Costa Brava bezeichnet man den Küstenbereich Spaniens, der in Blanes beginnt und an der Grenze zu Frankreich in Portbou endet. Es grenzt im Norden an die Vermella-Küste und im Süden an die Maresme-Küste. Dieser Küstenstreifen erstreckt sich über eine Fläche von 214 km und besteht aus den katalanischen Regionen Alto-Empordà, BAS-Empordà und La Selva.</p>
        <p>Es liegt in der Provinz Heron, die zur Autonomen Gemeinschaft Katalonien in Spanien gehört. Irgendwo hier wird Ihr neues Zuhause sein.</p>
    </div>

    <div class="section" style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/image4.png');">
        <h2>Wie können wir Ihnen helfen?</h2>
        <p>1.- Das Wichtigste ist, das zu finden, was Sie brauchen (Ihr Haus). Deshalb ist es sehr wichtig, gut zu beschreiben, wie es sein soll.</p>
        <p>2.- Verhandeln Sie den Preis</p>
        <p>3.- Unterstützung während des gesamten Kaufprozesses und Hilfe bei allen Formalitäten.</p>
        <p>4.- Hilfe bei der Beantragung der NIE (Foreign Resident Document), um die Immobilie erwerben zu können.</p>
        <p>5.- Eröffnen Sie ein Bankkonto, um die Immobilie erwerben zu können.</p>
        <p>6.- Bei Bedarf organisieren wir eine Bankfinanzierung.</p>
        <p>7.- Wenn der Kunde es wünscht, bieten wir ihm den Empfang am Flughafen und die Unterbringung im gewünschten Hotel an</p>
        <p>8.- Bei Bedarf übernehmen wir die Instandhaltung und Verwaltung der Immobilie nach dem Verkauf.</p>
        <p>9.- Hilfe bei der Anschaffung von Transportmitteln, Geräten usw. Falls erforderlich.</p>
        <p>10.- Wenn Reparatur-, Renovierungs- und Reinigungsarbeiten erforderlich sind, verfügen wir über die erforderlichen Kontakte.</p>
        <p>11.- Künstlerische Dekoration mit Ölgemälden, auf Anfrage.</p>
        <img src="<?php echo get_template_directory_uri(); ?>/images/tataempresarioEsperico.png" width="300" height="300">
        <p class="texto2">Kontakt: +34 722 279 795</p>
        <p class="texto2">Gmail: lacostahaus@gmail.com</p>
        <p class="texto2">Später reden</p>
        <p class="texto2">Español - Català - Română - Français - Deutsch - Русский</p>
    </div>

    <?php wp_footer(); ?>
</body>
</html>