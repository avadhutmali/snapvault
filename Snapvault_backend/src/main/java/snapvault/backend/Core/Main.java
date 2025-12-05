package snapvault.backend.Core;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;

public class Main {
    public static void main(String args[]) throws IOException, NoSuchAlgorithmException{

        String path1 = "test_v1";
        String path2 = "test_v2";

        var oldPaths = DirectoryScanner.directoryScanner(path1);
        var newPaths = DirectoryScanner.directoryScanner(path2);

        var oldHash = DirectoryScanner.getSnapShotHash(oldPaths,path1);
        var newHash = DirectoryScanner.getSnapShotHash(newPaths,path2);

        SnapshotDiff diff = Diff.findChanges(oldHash, newHash);

        ObjectStore objectStore = new ObjectStore();

        System.out.println("New Added files : ");

        if(diff.getAdded().isEmpty())System.out.println("No new files Added");
        else for(String s:diff.getAdded()){
            System.out.println(s);
            objectStore.storeFile(path2+"/"+s, newHash.get(s));
        }

        System.out.println("Modified files : ");

        if(diff.getModified().isEmpty())System.out.println("No Modified files");
        else for(String s:diff.getAdded()){
            System.out.println(s);
            objectStore.storeFile(path2+"/"+s, newHash.get(s));
        }

        System.out.println("Deleted files : ");

        if(diff.getDeleted().isEmpty())System.out.println("No files Deleted");
        else for(String s:diff.getAdded())System.out.println(s);
        
    }
}
