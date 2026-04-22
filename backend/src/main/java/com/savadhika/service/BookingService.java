package com.savadhika.service;

import com.savadhika.dto.BookingRequest;
import com.savadhika.model.Cart;
import com.savadhika.model.Massage;
import com.savadhika.repository.CartRepository;
import com.savadhika.repository.MassageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for handling booking operations
 * Manages cart and booking process
 */
@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final CartRepository cartRepository;
    private final MassageRepository massageRepository;
    
    /**
     * Add massage to cart
     */
    @Transactional
    public Cart addToCart(BookingRequest request) {
        // Verify massage exists
        massageRepository.findById(request.getMassageId())
            .orElseThrow(() -> new RuntimeException("Massage not found"));
        
        Cart cart = new Cart();
        cart.setCustomerId(request.getCustomerId());
        cart.setMassageId(request.getMassageId());
        cart.setBookingDate(request.getBookingDate());
        cart.setBookingTime(request.getBookingTime());
        
        return cartRepository.save(cart);
    }
    
    /**
     * Get all cart items for a customer with massage details
     */
    public List<Map<String, Object>> getCartItems(Long customerId) {
        List<Cart> cartItems = cartRepository.findByCustomerId(customerId);
        
        return cartItems.stream().map(cart -> {
            Map<String, Object> item = new HashMap<>();
            item.put("cartId", cart.getCartId());
            item.put("bookingDate", cart.getBookingDate());
            item.put("bookingTime", cart.getBookingTime());
            
            // Fetch massage details
            massageRepository.findById(cart.getMassageId()).ifPresent(massage -> {
                item.put("massageId", massage.getMassageId());
                item.put("massageName", massage.getMassageName());
                item.put("massageType", massage.getMassageType());
                item.put("massagePrice", massage.getMassagePrice());
                item.put("massageDuration", massage.getMassageDuration());
                item.put("massageZone", massage.getMassageZone());
            });
            
            return item;
        }).collect(Collectors.toList());
    }
    
    /**
     * Remove item from cart
     */
    @Transactional
    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }
    
    /**
     * Clear all cart items for a customer
     */
    @Transactional
    public void clearCart(Long customerId) {
        cartRepository.deleteByCustomerId(customerId);
    }
    
    /**
     * Get cart count for a customer
     */
    public long getCartCount(Long customerId) {
        return cartRepository.countByCustomerId(customerId);
    }
}
