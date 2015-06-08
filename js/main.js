$(document).ready(function() {

    $('#pay').click(function(){

        var  quantityElements = [],
            priceElements =[],
            nameElements = [],
            str = '';

        $('div.order-item-quantity').each(function(index, element) {
            quantityElements.push(+element.innerHTML);
        });

        $('div.order-item-price span').each(function(index, element) { // delete last element
            priceElements.push(+element.innerHTML);
        });

        $('div.order-item-name span').each(function(index, element) {
            nameElements.push(element.innerHTML);
        });

        for(var i=0; i<quantityElements.length; i++) {
            str += '|' + nameElements[i] + '|' + quantityElements[i] + '|' + priceElements[i];
        }

        var fullname = $('input#name').val(),
             email = $('input#email').val(),
             phone = $('input#phone').val(),
             country = $('input#country').val(),
             city = $('input#city').val(),
             street = $('input#street').val(),
             postal = $('input#postal').val(),
             deliveryType = $('select#deliveryType').val(),
             typeOfDelivery = $('#deliveryCheckbox').is(":checked"),
             pay = $('#cardCheckbox').is(":checked"),
             data = {
                fullname: fullname,
                phone: phone,
                country: country,
                city: city,
                street: street,
                postal: postal,
                str: str,
                email: email,
                deliveryType: deliveryType,
                pay: pay,
                typeOfDelivery: typeOfDelivery
            };

        $.ajax({
            url: 'scripts/actionSend.php',
            type: 'POST',
            data: data,
            success: function(result) {
                alert(result);
            },
            error: function(result) {
                alert(result);
            }
        });

    });

    // Fullpage Initialization 
    $('#fullpage').fullpage({
		scrollingSpeed: 600,
		verticalCentered: false,
		scrollOverflow: true,
        anchors: ['main', 'rock-you', 'bohemique', 'hands', 'funny-girl'],
        navigation: true,
        navigationPosition: 'right'
    });

    // Instafeed Initialization
    var feed = new Instafeed({
        get: 'user',
        userId: 1755828902,
        accessToken: '1755828902.1677ed0.a87d9feb70534de98bdbb552c2d6e823'

    });
    feed.run();

    var productArray = [];



    $('input#deliveryCheckbox').click(function(){
        var state = $('#deliveryCheckbox').is(":checked");
        if (state) {
            $('li#deliver').css('display', 'none');
            var price = $('span.order-total-amount').text();
            $('span.order-total-amount').text(parseInt(price)-600);
        } else {
            $('li#deliver').css('display', 'block');
            var price = $('span.order-total-amount').text();

            $('span.order-total-amount').text(parseInt(price)+600);
        }
    });



    $('.buy-btn').on('click', function() {

        $(this).attr("disabled", true);

        // Adding text and price to a popover
        var productName = $(this).attr("data-name");
        var productPrice = parseInt($(this).attr("data-price"));
        var appendName = $('.append-list');
        var appendPrice = $('.append-price');
        var orderList = $('.order-list');

        var addToOrderList = function() {
            var widget = $(
                '<li class="order-item">' +
                    '<div class="order-item-name">' +
                        'НАБОР "<span>' + productName + '</span>"' +
                    '</div>' +
                    '<div class="order-details">' +
                        '<div class="order-item-quantity">' +
                            '1' +
                        '</div>' +
                        '<div class="order-controls">' +
                            '<a href="javascript:void(0)" class="add"></a>' +
                            '<a href="javascript:void(0)" class="subtract"></a>' +
                        '</div>' +
                        '<div class="order-item-price">' +
                            '<span class="order-item-price-amount">' +
                                productPrice +
                            '</span>' +
                            ' РУБ' +
                        '</div>' +
                    '</div>' +
                '</li>'
            );

            widget.on('click', 'a.add', function () {
                // adding quantity
                var currentQuantity = $(this).closest('.order-item').find('.order-item-quantity');
                var newQuantity = parseInt(currentQuantity.text()) + 1
                currentQuantity.text(newQuantity);

                // adding amount
                var orderItemPriceAmount = $(this).closest('.order-item').find('.order-item-price-amount');
                var newOrderItemPriceAmount = parseInt(productPrice) * newQuantity
                orderItemPriceAmount.text(newOrderItemPriceAmount);
                // adding total
                var suma = 0;
                $('div.order-item-price span').each(function(index, element) { // delete last element
                    suma += parseInt(element.innerHTML);
                });
                $('.order-total-amount').text(suma);

            });
            widget.on('click', 'a.subtract', function () {

                var currentQuantity = $(this).closest('.order-item').find('.order-item-quantity');
                //console.log(currentQuantity);

                
                if(parseInt(currentQuantity.text()) >= 1) {
                    var newQuantity = parseInt(currentQuantity.text()) - 1
                    currentQuantity.text(newQuantity);
                } else {
                    return false
                }
                // subtracting amount
                var orderItemPriceAmount = $(this).closest('.order-item').find('.order-item-price-amount');
                var newOrderItemPriceAmount = parseInt(productPrice) * newQuantity
                orderItemPriceAmount.text(newOrderItemPriceAmount);
                // subtracting total

                var suma = 0;
                $('div.order-item-price span').each(function(index, element) { // delete last element
                    suma += parseInt(element.innerHTML);
                });
                $('.order-total-amount').text(suma);
            });

            orderList.prepend(widget);
        }

        var addNewProduct = function() {
            appendName.append('<span class="product-item">"' + productName + '"</span>');
            appendPrice.append(productPrice);
            addToOrderList();
        }

        var addExistingProduct = function() {
            appendName.append('<span class="product-item">, "' + productName + '"</span>');
            totalAmount = parseInt(appendPrice.text()) + productPrice;

            appendPrice.html(parseInt(totalAmount));

            //productPrice = totalAmount;
            addToOrderList();
        }

        if ($('.product-item').length == 0) {
            addNewProduct();

        } else if ($('.product-item').length == 3) {
            addExistingProduct();
            $(".message-wrapper").html("ВЫ ВЫБРАЛИ ВСЕ НАБОРЫ.")
            
        } else {
            addExistingProduct();
        }

        // Pushing data to array
        productArray.push(productName);

        console.log("Array of chosen projects: " + productArray);
        console.log("Total Price: " + productPrice);

        // "fly-to-cart" animation
    	var animateObj = $(this).closest('.frame').find('.set');
    	var section = $(this).closest('.section');
    	var animateToObj = $('.proceed-btn');
    	$(".selected-bar").addClass("visible");

        // Cloning DOM element to animate it
    	var cloneObj = animateObj
            .clone()
       	    .offset({
       	    	top: animateObj.offset().top,
       	    	left: animateObj.offset().left
       		})
       		.appendTo(section);

        // Removing the initial DOM element
        animateObj.remove();



        // Animating transition of cloned DOM element to a Proceed button
       	cloneObj.animate({
       		opacity: "1",
       		width: "0px",
       		height: "0px",
       		top: animateToObj.offset().top,
       		left: animateToObj.offset().left
       	}, {
       		easing: "easeInOutExpo",
       		duration: 900
       	});
        // END fly to cart animation
    });
    
    // Popup Code
    $('.popup-toggle').on('click', function() {
        var dataPopupToggle = $(this).data('popup-toggle');
        var popupWrapper = $('.popup-wrapper[data-popup-index="' + dataPopupToggle + '"]');
        var popup = popupWrapper.find('.popup');

        var suma = 0;
        $('div.order-item-price span').each(function(index, element) { // delete last element
            suma += parseInt(element.innerHTML);
        });
        $('.order-total-amount').text(suma);

        popupWrapper.addClass('active');
        setTimeout(function() {
            popupWrapper.addClass('visible');
        }, 50);
        setTimeout(function() {
            popup.addClass('visible');
        }, 250);
    });
    $('.popup-dismiss').on('click', function() {
        $('.popup-wrapper').removeClass('visible');
        $('.popup').removeClass('visible');
        setTimeout(function() {
            $('.popup-wrapper').removeClass('active');
        }, 300);
    });

    // Order code

});
