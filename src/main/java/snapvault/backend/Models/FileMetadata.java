package snapvault.backend.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class FileMetadata {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String originalPath;
    private String hash;
    private long size;


    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="snapvault_id")
    private SnapVault snapVault;

}
