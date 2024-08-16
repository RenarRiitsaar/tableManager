package com.tableManager.tableManager.controllers;

import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.tableManager.tableManager.model.CheckoutPayment;
import com.tableManager.tableManager.service.admin.impl.AdminServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin("*")
public class StripeController {

    private static final String endpointSecret = "sk_test_51Pl7V7RoGaLilpUFS5Mpb6X1uwQsoqZYXkyfAcKLcrQrKxnXcyOEEgg2q6dXDXDc8vqttvG5FMCCq2fy7NuEYfEq00TmCTfhS7";
    private final AdminServiceImpl adminService;

    private static Gson gson = new Gson();

    public StripeController(AdminServiceImpl adminService) {
        this.adminService = adminService;
    }



    @PutMapping("/success/{id}")
    public ResponseEntity<?> toggleUserActive(@PathVariable Long id){
        adminService.setActive(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/payment")
    public String paymentWithCheckoutPage(@RequestBody CheckoutPayment payment) throws StripeException {
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
        Map<String,String> responseData = new HashMap<>();
        responseData.put("id",session.getId());

        return gson.toJson(responseData);
    }


    private static void init() {
        Stripe.apiKey = "sk_test_51Pl7V7RoGaLilpUFS5Mpb6X1uwQsoqZYXkyfAcKLcrQrKxnXcyOEEgg2q6dXDXDc8vqttvG5FMCCq2fy7NuEYfEq00TmCTfhS7";
    }
}
