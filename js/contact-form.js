/*
--------------------------------
Ajax Contact Form
--------------------------------
+ https://github.com/mehedidb/Ajax_Contact_Form
+ A Simple Ajax Contact Form developed in PHP with HTML5 Form validation.
+ Has a fallback in jQuery for browsers that do not support HTML5 form validation.
+ version 1.0.1
+ Copyright 2016 Mehedi Hasan Nahid
+ Licensed under the MIT license
+ https://github.com/mehedidb/Ajax_Contact_Form
*/

/*
(function ($, window, document, undefined) {
    'use strict';

    var $form = $('#contact-form');

    $form.submit(function (e) {
        // remove the error class
        $('.form-group').removeClass('has-error');
        $('.help-block').remove();

        // get the form data
        var formData = {
            'name' : $('input[name="form-name"]').val(),
            'email' : $('input[name="form-email"]').val(),
            'subject' : $('input[name="form-subject"]').val(),
            'message' : $('textarea[name="form-message"]').val()
        };

        // process the form
        $.ajax({
            type : 'POST',
            url  : 'process.php',
            data : formData,
            dataType : 'json',
            encode : true
        }).done(function (data) {
            // handle errors
            if (!data.success) {
                if (data.errors.name) {
                    $('#name-field').addClass('has-error');
                    $('#name-field').find('.col-lg-10').append('<span class="help-block">' + data.errors.name + '</span>');
                }

                if (data.errors.email) {
                    $('#email-field').addClass('has-error');
                    $('#email-field').find('.col-lg-10').append('<span class="help-block">' + data.errors.email + '</span>');
                }

                if (data.errors.subject) {
                    $('#subject-field').addClass('has-error');
                    $('#subject-field').find('.col-lg-10').append('<span class="help-block">' + data.errors.subject + '</span>');
                }

                if (data.errors.message) {
                    $('#message-field').addClass('has-error');
                    $('#message-field').find('.col-lg-10').append('<span class="help-block">' + data.errors.message + '</span>');
                }
            } else {
                // display success message
                $form.html('<div class="alert alert-success">' + data.message + '</div>');
            }
        }).fail(function (data) {
            // for debug
            console.log(data)
        });

        e.preventDefault();
    });
}(jQuery, window, document));
*/
var nameRef = document.getElementById('form-name');
var emailRef = document.getElementById('form-email');
var dddRef = document.getElementById('form-ddd');
var phoneRef = document.getElementById('form-phone');
var companyRef = document.getElementById("form-company");
var sourceRef = document.getElementById('form-source');

var database = firebase.database();

function formSubmit(){
    
    let data = {
        nome: nameRef.value,
        email: emailRef.value,
        ddd: dddRef.value,
        telefone: phoneRef.value,
        empresa: companyRef.value,
        source: sourceRef.options[sourceRef.selectedIndex].text
    }

    //console.log(data)
    if (validateName(data.nome)==false){
        alert('Nome inválido, por favor insira o seu nome completo.');
        return 'nomeInvalido';
    }

    if (validateEmail(data.email)==false){
        alert('Email inválido, por favor preencha novamente.');
        return 'emailInvalido'
    }

    if (validateDDD(data.ddd)==false){
        alert('DDD inválido, por favor preencha novamente.');
        return 'DDDInvalido'
    }

    if (validatePhone(data.telefone)==false){
        alert('Telefone inválido, por favor preencha novamente.');
        return 'foneInvalido'
    }




    return firebase.database().ref('/meta/').once('value').then(function(snapshot) {

        const qtd = snapshot.val().qtd;

        return firebase.database().ref('/leads/').once('value').then(function(snapshot) {

        var i = 0;  
        var repetido=false
        
        for (i=1;i<=qtd;i++){

            //console.log(snapshot.val()[i].email);

            if (snapshot.val()[i].email == data.email){
                repetido = true;
                console.log('email repetido');
                alert('O e-mail informado já está cadastrado')
            }
            if (snapshot.val()[i].nome == data.nome){
                repetido = true;
                console.log('nome repetido');
                alert('O nome informado já está cadastrado')
            }

        }

        if (repetido == false){

            writeData(qtd,data);
            
            gtag('event','clique',{'event_category':'botao','event_label':'envio_formulario'});
            fbq('track', 'SubmitApplication');
            
            var popup = document.getElementById("myPopup");
            popup.classList.toggle("show");

            document.getElementById('submit-button').disabled = true

            setTimeout(function(){ 
                
                //alert("Hello");
                location.href= "https://www.sympla.com.br/success-talks-transformacao-da-sua-empresa-na-era-digital__407697"; 
            
            }, 3000);

            

        }

        });   

});

}


var tamanhoChanged = database.ref('meta/');



tamanhoChanged.on('value', function(snapshot) {

    let quant = snapshot.val().qtd;
    console.log(`Leads até o momento: ${quant}`);

});


function resetDB() {

    var pwd = prompt('certeza jovem? digite a senha:');

    if (pwd=='padreco'){

        database.ref('leads/').set({
        
        });  
        database.ref('meta/').set({
            qtd: 0
        });  


    }

}



function writeData(id,data){

    var updates = {};
    updates['leads/' + (id+1)] = {
        
        email: data.email, 
        nome: data.nome,
        telefone: `(${data.ddd})${data.telefone}`,
        empresa: data.empresa,
        source: data.source

    };

    updates['meta/']={
        qtd: id+1
    }

    //  database.ref('meta/').set({
    //     qtd: id+1
    // });  

    return firebase.database().ref().update(updates);

}



    //console.log(Number(data.ddd)<0)
    //console.log(data.nome.length)



function validatePhone(phone){

    if (phone.toString().length<8) {return false}
    //como valida um número de telefone?????

    return true;
}

function validateDDD(ddd){

    if (ddd>10 && ddd<100) {return true}

    return false;
}

function validateEmail(email){

    if (email.indexOf('@')<=1) {return false}
    if (email.lastIndexOf('.')<=email.indexOf('@')) {return false}
    if (email.lastIndexOf('.')==email.length-1) {return false}


    return true

}

function validateName(name){

    if ((name.indexOf(' ')<=0) || (name.indexOf(' ')==name.length-1)) {return false}
    else {return true}

}