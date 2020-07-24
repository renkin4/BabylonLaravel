<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

        <!-- Styles -->
        <style>
            html, body {
                padding: 0;
                margin: 0;
            }
            #app{
                width: 100%;
                height: 100vh;
            }

        </style>
    </head>
    <body> 
        <div id="app">
            <babylon-component></babylon-component>
        </div>
        <script src="{{ mix('js/app.js') }}"></script>
    </body>
</html>
