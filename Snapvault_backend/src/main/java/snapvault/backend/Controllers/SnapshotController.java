package snapvault.backend.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import snapvault.backend.DTOs.FileMetadataResponseDTO;
import snapvault.backend.DTOs.RestoreRequestDTO;
import snapvault.backend.DTOs.SnapshotRequest;
import snapvault.backend.DTOs.SnapshotResponseDTO;
import snapvault.backend.Services.SnapshotService;

@RestController
@RequestMapping("api/v1/snapshots")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SnapshotController {
    
    private final SnapshotService snapshotService;

    @PostMapping
    public ResponseEntity<String> createSnapShot(@RequestBody SnapshotRequest request){
        try{
            snapshotService.createSnapshot(request.getDirectoryPath(), request.getSnapShotName(),request.getProjectName());
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

    @PostMapping("/{snapShotId}/restore")
    public ResponseEntity<String> restoreSnapShot(@PathVariable Long snapShotId, @RequestBody RestoreRequestDTO request){
        try{
            snapshotService.restoreSnapShot(snapShotId, request.getRestorePath());
            return ResponseEntity.ok("Snapshot restored Succesfully");
        }
        catch(Exception e){
            return ResponseEntity.status(500).body("Error in restoring snapshot :"+e.getMessage());
        }
    }
}
