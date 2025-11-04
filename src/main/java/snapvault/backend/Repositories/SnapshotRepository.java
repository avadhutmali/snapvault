package snapvault.backend.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import snapvault.backend.Models.SnapVault;

public interface  SnapshotRepository extends JpaRepository<SnapVault, Long>{

    // Map<String, String> getLastSnapshotHashes();
    Optional<SnapVault> findFirstByOrderBySnapshotTimestampDesc();
    
}
