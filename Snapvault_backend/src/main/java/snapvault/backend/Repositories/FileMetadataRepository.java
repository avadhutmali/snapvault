package snapvault.backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import snapvault.backend.Models.FileMetadata;
import snapvault.backend.Models.SnapVault;


public interface  FileMetadataRepository extends JpaRepository<FileMetadata, Long>{
    
    List<FileMetadata> findBySnapVault(SnapVault snapVault);
}
