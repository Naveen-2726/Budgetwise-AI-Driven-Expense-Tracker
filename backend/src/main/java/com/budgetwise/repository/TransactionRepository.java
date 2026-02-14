package com.budgetwise.repository;

import com.budgetwise.entity.Transaction;
import com.budgetwise.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUserOrderByTransactionDateDesc(User user);
    
    Page<Transaction> findByUserOrderByTransactionDateDesc(User user, Pageable pageable);

    List<Transaction> findTop6ByUserOrderByTransactionDateDesc(User user);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal sumAmountByUserAndType(@Param("user") User user, @Param("type") Transaction.TransactionType type);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user = :user")
    Long countByUser(@Param("user") User user);
    
    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}