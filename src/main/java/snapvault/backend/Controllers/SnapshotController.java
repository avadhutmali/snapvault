package snapvault.backend.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import snapvault.backend.DTOs.FileMetadataResponseDTO;
import snapvault.backend.DTOs.SnapshotRequest;
import snapvault.backend.DTOs.SnapshotResponseDTO;
import snapvault.backend.Services.SnapshotService;

@RestController
@RequestMapping("api/v1/snapshots")
@RequiredArgsConstructor
public class SnapshotController {
    
    private final SnapshotService snapshotService;

    @PostMapping
    public ResponseEntity<String> createSnapShot(@RequestBody SnapshotRequest request){
        System.out.println(request.getDirectoryPath());
        System.out.println(request.getSnapShotName());
        try{
            snapshotService.createSnapshot(request.getDirectoryPath(), request.getSnapShotName());
            return ResponseEntity.ok("Snapshot created succesfully");
        }catch(Exception e){
            return ResponseEntity.status(500).body("Error in creating Snapshot "+e.getMessage());
        }
    }

    @GetMapping
    public List<SnapshotResponseDTO> getAllSnapShots(){
        return snapshotService.getAllSnapShots();
    }

    @GetMapping("/{id}")
    public List<FileMetadataResponseDTO> getSnapShotFiles(@PathVariable Long id){
        return snapshotService.getSnapShotFiles(id);
    }
}
