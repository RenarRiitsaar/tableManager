package com.tableManager.tableManager.controllers;

import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.tableManager.tableManager.model.CheckoutPayment;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.service.admin.impl.AdminServiceImpl;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin("*")
public class StripeController {

    private static final String endpointSecret = "whsec_........";
    private String stripeApiKey = "pk_test_51Pl7V7RoGaLilpUFphwzkwitBGQnEXtwPScgHiA6U0y5Tmpbm2vxRxjGqHuXFdOHJeqhvuR25AZptNyMXBEwA6Yb00Kd8FbCZ8";
    private final AdminServiceImpl adminService;
    private final UserServiceImpl userService;
    private Long sessionUser;

    private static Gson gson = new Gson();

    public StripeController(AdminServiceImpl adminService, UserServiceImpl userService) {
        this.adminService = adminService;
        this.userService = userService;
    }


    @GetMapping("/userStatus/{id}")
    public ResponseEntity<String> getUserStatus(@PathVariable Long id) {

        User user = userService.findbyId(id);

        if(user.isEnabled()){
            return new ResponseEntity<>("User enabled", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("User disabled", HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Stripe.apiKey = stripeApiKey;

        Event event;

        try {
            event = Webhook.constructEvent(
                    payload, sigHeader, endpointSecret
            );
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }


        switch (event.getType()) {
            case "payment_intent.succeeded":
               adminService.setActive(sessionUser);
                break;

            default:
                System.out.println("Unhandled event type: " + event.getType());
        }
        return ResponseEntity.ok("Event handled");
    }





    @PutMapping("/success/{id}")
    public ResponseEntity<?> toggleUserActive(@PathVariable Long id){
        adminService.setActive(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/payment/{userId}")
    public String paymentWithCheckoutPage(@PathVariable Long userId, @RequestBody CheckoutPayment payment) throws StripeException {
        init();

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT).setSuccessUrl(payment.getSuccessUrl())
                .setCancelUrl(
                        payment.getCancelUrl())
                .addLineItem(
                        SessionCreateParams.LineItem.builder().setQuantity(payment.getQuantity())
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(payment.getCurrency()).setUnitAmount(payment.getAmount())
                                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData
                                                        .builder().setName(payment.getName()).build())
                                                .build())
                                .build())
                .build();

        Session session = Session.create(params);

         sessionUser = userId;
        Map<String,String> responseData = new HashMap<>();
        responseData.put("id",session.getId());

        return gson.toJson(responseData);
    }


    private static void init() {
        Stripe.apiKey = "sk_test_51Pl7V7RoGaLilpUFS5Mpb6X1uwQsoqZYXkyfAcKLcrQrKxnXcyOEEgg2q6dXDXDc8vqttvG5FMCCq2fy7NuEYfEq00TmCTfhS7";
    }
}
