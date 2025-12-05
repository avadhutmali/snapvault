package snapvault.backend.Core;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class DirectoryScanner {
    // public static Map<String,String> directoryScanner(String directoryPath) throws IOException, NoSuchAlgorithmException{
    //     List<Path> allPath = Files.walk(Paths.get(directoryPath)).filter(Files::isRegularFile).collect(Collectors.toList());

    //     Map<String, String> map = new HashMap<>();
    //     for(Path path : allPath){
    //         String relativePath = Paths.get(directoryPath).relativize(path).toString();
    //         String hash = FileHasher.generateFileHash(path.toString());
    //         map.put(relativePath, hash);
    //     }
    //     return map;
    // }
    public static List<Path> directoryScanner(String directoryPath) throws IOException, NoSuchAlgorithmException{
        try(Stream<Path> streams = Files.walk(Paths.get(directoryPath))){
            return streams.filter(Files::isRegularFile).collect(Collectors.toList());
        }
    }
    public static Map<String,String> getSnapShotHash(List<Path> paths, String DirectoryPath) throws IOException, NoSuchAlgorithmException {
        Map<String,String> map = new HashMap<>();
        for(Path path : paths){
            String relativePath = Paths.get(DirectoryPath).relativize(path).toString();
            String hash = FileHasher.generateFileHash(relativePath.toString());
            map.put(relativePath,hash);
        }
        return map;
    }

}
