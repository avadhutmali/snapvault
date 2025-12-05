package snapvault.backend.Services;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import snapvault.backend.Core.*;
import snapvault.backend.DTOs.FileMetadataResponseDTO;
import snapvault.backend.DTOs.SnapshotResponseDTO;
import snapvault.backend.Models.FileMetadata;
import snapvault.backend.Models.SnapVault;
import snapvault.backend.Repositories.FileMetadataRepository;
import snapvault.backend.Repositories.SnapshotRepository;

@Service
@RequiredArgsConstructor
public class SnapshotService {
    
    private final SnapshotRepository snapshotRepository;
    private final FileMetadataRepository fileMetadataRepository;
    private final ObjectStore objectStore = new ObjectStore();

    public void createSnapshot(String directoryPath, String snapshotName) throws IOException, NoSuchAlgorithmException{
        
        Map<String ,String> oldHashes = getLastSnapshotHashes();
        List<Path> paths = DirectoryScanner.directoryScanner(directoryPath);
        Map<String ,String> newHashes = getSnapShotHash(paths,directoryPath);


        SnapshotDiff snapshotDiff = Diff.findChanges(oldHashes, newHashes);

        SnapVault snapVault = new SnapVault();

        //Added
        if(snapshotDiff.getAdded().isEmpty())System.out.println("No new files Added");
        else for(String s:snapshotDiff.getAdded()){
            objectStore.storeFile(directoryPath+"/"+s, newHashes.get(s));
        }

        //Modified
        if(snapshotDiff.getModified().isEmpty())System.out.println("No Modified files");
        else for(String s:snapshotDiff.getModified()){
            objectStore.storeFile(directoryPath+"/"+s, newHashes.get(s));
        }

        //Deleted
        if(snapshotDiff.getDeleted().isEmpty())System.out.println("No files Deleted");
        else for(String s:snapshotDiff.getDeleted()){
            System.out.println("File Deleted are "+s);
        }

        //create snapvault
        snapVault.setSnapShotName(snapshotName);
        snapVault.setSnapshotTimestamp(LocalDateTime.now());
        snapVault = snapshotRepository.save(snapVault);

        //create metadata
        for(String key : newHashes.keySet()){
            FileMetadata fileMetadata = new FileMetadata();
            fileMetadata.setOriginalPath(key);
            fileMetadata.setHash(newHashes.get(key));
            fileMetadata.setSnapVault(snapVault);
            fileMetadataRepository.save(fileMetadata);
        }
    }

    private Map<String,String> getLastSnapshotHashes(){
        Optional<SnapVault> snapVaultOpt = snapshotRepository.findFirstByOrderBySnapshotTimestampDesc();

        if(snapVaultOpt.isEmpty()) return new HashMap<>();

        SnapVault lastestSnapVault = snapVaultOpt.get();
        Map<String,String> LastSnapShotHashes = new HashMap<>();

        List<FileMetadata> files = fileMetadataRepository.findBySnapVault(lastestSnapVault);

        for(FileMetadata data : files){
            LastSnapShotHashes.put(data.getOriginalPath(),data.getHash());
        }
        return LastSnapShotHashes;
        
    }
    private Map<String,String> getSnapShotHash(List<Path> paths,String DirectoryPath) throws IOException, NoSuchAlgorithmException {
        Map<String,String> map = new HashMap<>();
        for(Path path : paths){
            String relativePath = Paths.get(DirectoryPath).relativize(path).toString();
            String hash = FileHasher.generateFileHash(path.toString());
            map.put(relativePath,hash);
        }
        return map;
    }

    public List<SnapshotResponseDTO> getAllSnapShots(){

        List<SnapshotResponseDTO> list = new ArrayList<>();

        for(SnapVault snap : snapshotRepository.findAll()){
            list.add(new SnapshotResponseDTO(snap.getId(),snap.getSnapShotName(),snap.getSnapshotTimestamp()));
        }
        return list;
    }

    public List<FileMetadataResponseDTO> getSnapShotFiles(Long snapShotId){
        List<FileMetadataResponseDTO> list = new ArrayList<>();
        Optional<SnapVault> snap = snapshotRepository.findById(snapShotId);
        if(snap.isEmpty()){
            return new ArrayList<>();
        }
        for(FileMetadata data : fileMetadataRepository.findBySnapVault(snap.get())){
            list.add(new FileMetadataResponseDTO(data.getOriginalPath(), data.getHash(), data.getSize()));
        }

        return list;
    }

    public void restoreSnapShot(Long snapShotId, String restorePath) throws IOException{
        Optional<SnapVault> snapVault = snapshotRepository.findById(snapShotId);

        if(snapVault.isEmpty())throw new RuntimeException("Snapshot not Found InvalidID");
        List<FileMetadata> files = fileMetadataRepository.findBySnapVault(snapVault.get());

        for(FileMetadata data : files){
            String originalPath = restorePath+"/"+data.getOriginalPath();
            objectStore.restoreFileHelper(originalPath, data.getHash());
        }
    }




}
