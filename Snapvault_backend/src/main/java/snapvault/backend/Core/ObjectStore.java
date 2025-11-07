package snapvault.backend.Core;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class ObjectStore {
    private static final String SOURCE_PATH = "snapvault_data";

    public String storeFile(String sourceFilePath, String hash) throws IOException{
        Files.createDirectories(Paths.get(SOURCE_PATH));
        
        String destinationPath = SOURCE_PATH+"/"+hash;

        if(!Files.exists(Paths.get(destinationPath))){
            Files.copy(Paths.get(sourceFilePath), Paths.get(destinationPath));
        }

        return destinationPath;

    }

    public String restoreFileHelper(String originalPath , String hash) throws IOException{

        String targetPath = SOURCE_PATH+"/"+hash;
        if(!Files.exists(Paths.get(targetPath))){
            throw new IOException("Backup not Found for hash "+hash);
        }

        Path original = Paths.get(originalPath);
        
        if(original.getParent()!=null){
            Files.createDirectories(original.getParent());
        }

        Files.copy(Paths.get(targetPath), Paths.get(originalPath), StandardCopyOption.REPLACE_EXISTING);
        
        return originalPath;
    }
}
